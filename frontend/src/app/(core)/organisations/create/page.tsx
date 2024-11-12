"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CONTRACTS } from "@/lib/contracts/config";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useFormState, useFormStatus } from "react-dom";

import {
  useWriteContract,
  useSimulateContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import UploadThing, { FileUpload } from "@/components/UploadThing";
import Image from "next/image";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { createOrganisation } from "@/actions/organisation";
import { AnimatedContainer } from "@/components";

export default function CreateOrganisationModal() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { writeContractAsync, data: hash } = useWriteContract();
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const initialState = {
    name: "",
    imageUrl: "",
    description: "",
    status: 0,
    message: "",
  };

  // form status
  const { pending } = useFormStatus();

  const [newOrganisation, formAction] = useFormState(
    createOrganisation,
    initialState
  );

  const { data, status } = useSimulateContract({
    address: CONTRACTS.ORGANIZATION_CAMPAIGNS.address,
    abi: CONTRACTS.ORGANIZATION_CAMPAIGNS.abi,
    functionName: "createOrganization",
    args: [newOrganisation.name, imageUrl, newOrganisation.description],
    query: {
      enabled: !!newOrganisation,
    },
  });

  //write listing to smart contract
  const write0x = async () => {
    await writeContractAsync?.(data!.request);
    toast.success("Organisation has been created");
    queryClient.invalidateQueries({ queryKey: ["organisations"] });
    queryClient.invalidateQueries({ queryKey: ["tnxs"] });
  };

  const { status: confirmStatus } = useWaitForTransactionReceipt({
    hash,
    confirmations: 1,
  });

  //watch for listing creation
  useEffect(() => {
    //activate loader
    if (newOrganisation.status === 0) {
      setIsLoading(true);
      //write listing to smart contract when validation is success
      if (status === "success") {
        write0x();
      }
    }
  }, [newOrganisation, status]);

  //watch for on-chain confirmation
  useEffect(() => {
    if (confirmStatus === "success") {
      router.push(`/organisations/`);
    }
  }, [confirmStatus, router]);
  return (
    <AnimatedContainer className="flex flex-col gap-8 max-w-screen-md mx-auto px-4 pt-20 min-h-screen">
      <div className="min-w-full">
        <div className="flex flex-col gap-4 pb-6">
          {/* Add back button */}
          <button
            onClick={() => router.back()}
            className="flex bg-white rounded-full h-10 w-10 shadow-md justify-center items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>

          <div >
            <h1 className="text-text-primary text-lg md:text-xl font-semibold">
              Create Organisation
            </h1>
          </div>
        </div>
        <div className="relative flex-col gap-8 md:flex space-y-4 w-full">
          <form
            action={formAction}
            className="grid grid-cols-1 md:grid-cols-2 w-full gap-6"
          >
            <div className="space-y-4">
              <div className="grid gap-3">
                <Label htmlFor="name">Organisation Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Web3clubs"
                  name="name"
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Description"
                  name="description"
                  className="h-36"
                />
              </div>
            </div>

            <div className="grid gap-3 h-full">
              <Label htmlFor="imageUrl">Organization Image</Label>
              <div className="flex flex-col gap-y-2">
               
               <UploadThing/>
              </div>

              <div className="flex items-end justify-end">
              <Button
                disabled={pending}
                size="lg"
                className="w-fit"
                variant="create"
                type="submit"
              >
                {pending && (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Organization
              </Button>
            </div>

            
            </div>
           
           
          </form>
        </div>
      </div>
    </AnimatedContainer>
  );
}
