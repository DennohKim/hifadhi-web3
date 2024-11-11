"use client";
// import Image from "next/image";
import { useRouter } from "next/navigation";

import { useLogin, usePrivy } from "@privy-io/react-auth";
import { AnimatedContainer, AnimatedItem, Preloader } from "@/components";

import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { ready, authenticated } = usePrivy();
  const disableLogin = !ready || (ready && authenticated);
  const [showPreloader, setShowPreloader] = useState(false);

  const { login } = useLogin({
    onComplete: () => {
      router.push("/dashboard");
    },
  });

  if (showPreloader) return <Preloader isLoading={showPreloader} />;

  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-8"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Vunavault</span>
              <Image
                alt="Vunavault Logo"
                width={200}
                height={100}
                src="/logos/vunavault.png"
                className="h-8 w-auto"
              />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
        </nav>
        <Dialog
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
          className="lg:hidden"
        >
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <Image
                  alt="Company Logo"
                  width={200}
                  height={100}
                  src="/logos/vunavault.png"
                  className="h-8 w-auto"
                />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div className="mx-auto max-w-3xl py-16 sm:py-24 lg:py-32">
          <AnimatedItem>
            <div className="hidden sm:mb-8 sm:flex sm:justify-center"></div>
          </AnimatedItem>

          <AnimatedContainer>
            <div className="text-center">
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
                Transform Your Savings Goals into Reality with VunaVault{" "}
              </h1>
              <p className="mt-8 text-pretty text-md font-medium text-gray-500 sm:text-xl/8">
                Set personalized savings goals, automate your contributions, and
                watch your savings grow through Aave lending pools while Gelato
                handles all the automation.
              </p>
              <AnimatedItem>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <Button
                    onClick={() => login()}
                    disabled={disableLogin}
                    className="rounded-md bg-[#0065F5] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0065F5]/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0065F5]"
                  >
                    Login
                  </Button>
                  <button
                    onClick={login}
                    className="text-sm/6 font-semibold text-gray-900"
                  >
                    Sign up
                  </button>
                </div>
              </AnimatedItem>
            </div>
          </AnimatedContainer>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>
    </div>
  );
}
