"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CONTRACTS } from "@/lib/contracts/config";
import { useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

import {
  useWriteContract,
  useSimulateContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import Image from "next/image";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { AnimatedContainer } from "@/components";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import Error from "next/error";
import { Abi } from "viem";
import { usePrivy } from "@privy-io/react-auth";
import { useSetActiveWallet } from "@privy-io/wagmi";
import { useWallets } from "@privy-io/react-auth";
import { useAllOrganizations } from "@/actions/organisation";
import { useAllCampaigns, useCampaignCount } from "@/actions/campaigns";

type FormData = {
  name: string;
  description: string;
};

export default function CreateOrganisationModal() {
  const router = useRouter();
  const { writeContractAsync, data: hash } = useWriteContract();
  const { ready, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const { setActiveWallet } = useSetActiveWallet();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");

    const { refetch: refetchOrgDetails } = useAllOrganizations();
    const {  refetch: refetchCampaignCount } = useCampaignCount();
  const {  refetch: refetchCampaigns } = useAllCampaigns();
  

  // Watch form values and debounce them
  const watchedName = watch("name");
  const watchedDescription = watch("description");
  const debouncedName = useDebounce(watchedName, 300);
  const debouncedDescription = useDebounce(watchedDescription, 300);

  const contractConfig = {
    address: CONTRACTS.ORGANIZATION_CAMPAIGNS.address,
    abi: CONTRACTS.ORGANIZATION_CAMPAIGNS.abi.abi as Abi,
    functionName: "createOrganization",
  } as const;


  const { isLoading: isWaiting, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const isSubmitting = isLoading || isWaiting;
  const isSubmitDisabled =
    isSubmitting || !debouncedName || !debouncedDescription || !imageUrl;

  const onSubmit = async (data: FormData) => {
    if (!authenticated) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!imageUrl) {
      toast.error("Please upload an image");
      return;
    }

    setIsLoading(true);

    try {
      const activeWallet = wallets[0];
      if (activeWallet) {
        await setActiveWallet(activeWallet);
      }

  // Pass the arguments to writeContractAsync
  const hash = await writeContractAsync({
        ...contractConfig,
        args: [debouncedName, imageUrl, debouncedDescription],
      });
      toast.success("Transaction submitted", {
        description: `Transaction hash: ${hash}`,
      });

      router.push("/organisations")
    } catch (error) {
      console.error("Contract error:", error);
      toast.error("Failed to create organization", {
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsLoading(false);
      refetchOrgDetails();
      refetchCampaignCount();
      refetchCampaigns();
    }
  };

  return (
    <AnimatedContainer className="flex flex-col gap-8 max-w-screen-md mx-auto px-4 pt-20 min-h-screen py-10 font-jakarta">
      <div className="min-w-full">
        <div className="flex flex-col gap-4 pb-6">
          <button
            onClick={() => router.back()}
            className="flex bg-white rounded-full h-10 w-10 shadow-md justify-center items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>

          <div>
            <h1 className="text-text-primary text-lg md:text-xl font-bold">
              Create Organisation
            </h1>
          </div>
        </div>
        <div className="relative flex-col gap-8 md:flex space-y-4 w-full">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 max-w-7xl space-y-4"
          >
            <div className="space-y-4">
              <div className="grid gap-3">
                <Label htmlFor="name">Organisation Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Web3clubs"
                  {...register("name", { required: true })}
                />
                {errors.name && (
                  <span className="text-red-500">This field is required</span>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Description"
                  {...register("description", { required: true })}
                />
                {errors.description && (
                  <span className="text-red-500">This field is required</span>
                )}
              </div>
            </div>

            <div className="grid gap-3 h-full">
              <Label htmlFor="imageUrl">Organization Image</Label>
              <div className="flex flex-col gap-y-2 ">
                <div className="flex flex-col gap-4">
                  <UploadDropzone
                    endpoint="videoAndImage"
                    onClientUploadComplete={(res) => {
                      if (res?.[0]) setImageUrl(res[0].url);
                      toast.success("Upload Completed");
                    }}
                    onUploadError={(error) => {
                      toast.error(`ERROR! ${error.message}`);
                    }}
                    onUploadBegin={() => {
                      console.log("upload begin");
                    }}
                    appearance={{
                      container:
                        "mt-4 border-2 border-dashed border-slate-300 rounded-lg h-32",
                      label: "text-slate-500",
                      allowedContent: "text-slate-500 text-sm",
                      uploadIcon: "text-slate-400",
                      button:
                        "bg-blue-500 hover:bg-blue-600 text-white ut-uploading:bg-blue-500/50 px-6",
                    }}
                    content={{
                      label: "Drop your image here or click to browse",
                      allowedContent: "Images up to 4MB",
                      button({ ready, isUploading }) {
                        if (!ready) return "Getting ready...";
                        if (isUploading) return "Uploading...";
                        return "Upload";
                      },
                    }}
                  />

                  <UploadButton
                    endpoint="videoAndImage"
                    onClientUploadComplete={(res) => {
                      if (res?.[0]) setImageUrl(res[0].url);
                      toast.success("Upload Completed");
                    }}
                    onUploadBegin={() => {
                      console.log("upload begin");
                    }}
                    appearance={{
                      button: "bg-blue-500 hover:bg-blue-600 text-white text-sm px-6",
                      allowedContent: "text-slate-500 text-sm",
                    }}
                  />

                  {imageUrl && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-slate-900">
                        Uploaded Image:
                      </h3>
                      <Image
                        src={imageUrl}
                        alt="Uploaded"
                        width={300}
                        height={300}
                        className="mt-2 max-w-[300px] rounded-lg border border-slate-200"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-end justify-end">
                <Button
                  disabled={isSubmitDisabled}
                  size="lg"
                  className="w-fit"
                  variant="create"
                  type="submit"
                >
                  {isSubmitting && (
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isWaiting ? "Creating..." : "Create Organization"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AnimatedContainer>
  );
}