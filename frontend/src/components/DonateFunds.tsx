"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CONTRACTS } from "@/lib/contracts/config";
import { formatCurrency } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { formatUnits, parseUnits } from "viem";
import {
  useBalance,
  useWriteContract,
  useWaitForTransactionReceipt,
  usePublicClient,
} from "wagmi";
import { useWallets } from '@privy-io/react-auth'; // Add this import


type FormData = {
  amount: string;
  phoneNumber?: string;
};

// Add this prop to the component
interface DonateFundsProps {
  onDepositSuccess?: () => void;
}

export function DonateFunds({ onDepositSuccess }: DonateFundsProps) {
  const { wallets } = useWallets();
  const activeWallet = wallets[0]; // Get the first connected wallet
  const address = activeWallet?.address;
  console.log(address);
  const publicClient = usePublicClient();
  const campaignId = useParams().campaignId;
  const [isApproving, setIsApproving] = useState(false);
  const [approvalHash, setApprovalHash] = useState<`0x${string}` | undefined>();
  const [depositHash, setDepositHash] = useState<`0x${string}` | undefined>();

  // Get USDC balance
  const { data: balance, isLoading: isBalanceLoading, refetch: refetchBalance } = useBalance({
    address: address as `0x${string}`,
    token: CONTRACTS.USDC.address,
  });

  // USDC Approval hooks
  const { writeContractAsync: approveUSDC } = useWriteContract();
  const { isLoading: isApprovalLoading, isSuccess: isApprovalSuccess } =
    useWaitForTransactionReceipt({
      hash: approvalHash,
    });

  // Deposit hooks
  const { writeContractAsync: deposit } = useWriteContract();
  const { isLoading: isDepositLoading, isSuccess: isDepositSuccess } =
    useWaitForTransactionReceipt({
      hash: depositHash,
    });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      amount: "",
      phoneNumber: "",
    },
  });

  const formattedBalance = balance
    ? formatCurrency(
        Number(formatUnits(balance.value, balance.decimals)),
        "USD",
        "en-US"
      )
    : "$0.00";

  const onSubmit = async (data: FormData) => {
    if (!address || !campaignId) return;

    try {
      setIsApproving(true);
      const amount = parseUnits(data.amount, 6); // USDC has 6 decimals

      // First approve USDC spending
      const approvalTx = await approveUSDC({
        address: CONTRACTS.USDC.address,
        abi: CONTRACTS.USDC.abi.abi,
        functionName: "approve",
        args: [CONTRACTS.ORGANIZATION_CAMPAIGNS.address, amount],
      });

      setApprovalHash(approvalTx);

      // Wait for the approval transaction to be mined
      await publicClient?.waitForTransactionReceipt({ hash: approvalTx });
      toast.success("USDC approved for spending");

      // Then make the deposit
      const depositTx = await deposit({
        address: CONTRACTS.ORGANIZATION_CAMPAIGNS.address,
        abi: CONTRACTS.ORGANIZATION_CAMPAIGNS.abi.abi,
        functionName: "deposit",
        args: [BigInt(campaignId as string), amount],
      });

      setDepositHash(depositTx);
      toast.success("Transaction submitted");

      // Wait for deposit transaction to be mined
      await publicClient?.waitForTransactionReceipt({ hash: depositTx });
      toast.success("Deposit successful!");

      // Refetch the balance
      refetchBalance();

      // Call the success callback if provided
      if (onDepositSuccess) {
        onDepositSuccess();
      }

      // Reset form and hashes
      reset();
      setApprovalHash(undefined);
      setDepositHash(undefined);
    } catch (error) {
      console.error("Deposit error:", error);
      toast.error("Failed to make deposit", {
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsApproving(false);
    }
  };

  const isTransactionInProgress = isApprovalLoading || isDepositLoading;
  const isSubmitDisabled =
    isBalanceLoading || isApproving || isTransactionInProgress;

  const getButtonText = () => {
    if (isApprovalLoading) return "Approving USDC...";
    if (isDepositLoading) return "Processing Deposit...";
    if (isApproving) return "Preparing Transaction...";
    return "Contribute";
  };

  return (
    <Tabs defaultValue="contribute" className="w-full ">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="contribute">Contribute</TabsTrigger>
        <TabsTrigger value="mpesa">Mpesa</TabsTrigger>
      </TabsList>
      <TabsContent value="contribute">
        <Card>
          <CardHeader>
            <CardTitle>Contribute</CardTitle>
            <CardDescription>Deposit USDC to the campaign</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Wallet Balance</Label>
                <p className="text-lg font-bold">
                  {isBalanceLoading ? "Loading..." : formattedBalance}
                </p>
              </div>
              <div className="space-y-1">
                <Label htmlFor="amount">Contribution Amount (USDC)</Label>
                <Input
                  {...register("amount", {
                    required: "Amount is required",
                    min: {
                      value: 5, // Minimum contribution of 5 USDC
                      message: "Minimum contribution is 5 USDC",
                    },
                    validate: {
                      notAboveBalance: (value) => {
                        if (!balance) return true;
                        const amount = parseUnits(value, 6);
                        return (
                          amount <= balance.value || "Amount exceeds balance"
                        );
                      },
                    },
                  })}
                  type="number"
                  placeholder="20"
                  disabled={isSubmitDisabled}
                />
                {errors.amount && (
                  <p className="text-sm text-red-500">
                    {errors.amount.message}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 w-full">
              <Button
                variant="create"
                className="w-full"
                type="submit"
                disabled={isSubmitDisabled}
              >
                {getButtonText()}
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                type="submit"
                disabled
              >
                Auto Contribute
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
      <TabsContent value="mpesa">
        <Card>
          <CardHeader>
            <CardTitle>Pay with Mpesa</CardTitle>
            <CardDescription>
              Enter your phone number to pay with Mpesa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" />
            </div>
          </CardContent>
          <CardFooter>
            <Button disabled variant="create" className="w-full">
              Pay
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
