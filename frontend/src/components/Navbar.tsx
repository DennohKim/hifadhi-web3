"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";

import {
  CheckmarkIcon,
  CopyIcon,
  LogoutIcon,
  PrivateKeyIcon,
  SettingsIcon,
  WalletIcon,
} from "./ImageAssets";
import { Preloader } from "./Preloader";
import { useOutsideClick } from "@/hooks/hooks";
import { dropdownVariants } from "./Animations";
import { classNames, shortenAddress } from "@/lib/utils";
import Image from "next/image";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Organisations", href: "/organisations" },
  { name: "Goal Savings", href: "/goal-savings" },
];

export const Navbar = () => {
  // const router = useRouter();
  const pathname = usePathname();
  const [isAddressCopied, setIsAddressCopied] = useState(false);
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, logout, exportWallet } = usePrivy();

  // Update the active link check function
const isActiveRoute = (pathname: string, href: string) => {
	// Check if the current path starts with the href (for parent and child routes)
	return pathname.startsWith(href);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(user?.wallet?.address ?? "");
    setIsAddressCopied(true);
    setTimeout(() => setIsAddressCopied(false), 2000);
  };

  const handleLogout = async () => {
    setIsSettingsDropdownOpen(false);
    setIsLoggingOut(true);
    await logout();
  };

  const settingsDropdownRef = useRef<HTMLDivElement>(null);
  useOutsideClick({
    ref: settingsDropdownRef,
    handler: () => setIsSettingsDropdownOpen(false),
  });

  if (isLoggingOut) return <Preloader isLoading={isLoggingOut} />;

  return (
    <header className="fixed left-0 top-0 z-20 w-full bg-white transition-all">
      <nav
        aria-label="Global"
        className="container mx-auto max-w-screen-md flex items-center justify-between p-4 text-text-primary"
      >
        <div className="flex lg:flex-1">
          <Link href="/dashboard" className="group outline-none">
            <div className="flex items-center gap-1 lg:flex-1 group-focus:ring-2 group-focus:ring-primary-blue group-focus:ring-offset-2 group-focus:ring-offset-white rounded">
              <Image
                src="/logos/vunavault.png"
                alt="VunaVault"
                width={150}
                height={100}
                className=""
              />
            </div>
          </Link>
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
        <div className="hidden lg:flex lg:gap-x-12">
		{navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={classNames(
              "text-sm/6 font-normal",
              isActiveRoute(pathname, item.href) ? "text-[#0065F5]" : "text-gray-900"
            )}
          >
            {item.name}
          </a>
        ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <div className="flex gap-4 text-sm font-normal">
            {/* Settings Dropdown */}
            <div ref={settingsDropdownRef} className="relative">
              <button
                type="button"
                aria-label="Wallet details"
                aria-haspopup="true"
                onClick={() =>
                  setIsSettingsDropdownOpen(!isSettingsDropdownOpen)
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-gray-50 p-2.5 shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-95"
              >
                <SettingsIcon
                  className={classNames(
                    "transition-transform duration-300 ease-in-out",
                    isSettingsDropdownOpen ? "rotate-180" : ""
                  )}
                />
              </button>

              {/* Dropdown menu */}
              {isSettingsDropdownOpen && (
                <motion.div
                  initial="closed"
                  animate={isSettingsDropdownOpen ? "open" : "closed"}
                  exit="closed"
                  variants={dropdownVariants}
                  aria-label="Dropdown menu"
                  className="absolute right-0 z-10 mt-4 w-48 space-y-4 overflow-hidden rounded-xl bg-gray-50 shadow-xl"
                >
                  <ul
                    aria-labelledby="settings-dropdown"
                    className="text-sm text-text-primary font-normal"
                  >
                    <li>
                      <button
                        type="button"
                        onClick={handleCopyAddress}
                        className="flex cursor-pointer items-center justify-between gap-2 px-4 py-2 transition hover:bg-gray-200 w-full group"
                      >
                        <div className="flex items-center gap-2.5">
                          <WalletIcon className="text-text-secondary" />
                          <p className="max-w-40 break-words">
                            {shortenAddress(user?.wallet?.address ?? "")}
                          </p>
                        </div>

                        <div>
                          {isAddressCopied ? (
                            <CheckmarkIcon className="size-4 text-primary-blue" />
                          ) : (
                            <CopyIcon className="size-4 transition text-text-secondary group-hover:text-primary-blue" />
                          )}
                        </div>
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={exportWallet}
                        className="flex items-center gap-2.5 px-4 py-2 transition hover:bg-gray-200 w-full"
                      >
                        <PrivateKeyIcon className="text-text-secondary" />
                        <p>Export wallet</p>
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 px-4 py-2 transition hover:bg-gray-200 w-full"
                      >
                        <LogoutIcon className="text-text-secondary" />
                        <p>Sign out</p>
                      </button>
                    </li>
                  </ul>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
			  {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={classNames(
                "-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold hover:bg-gray-50",
                isActiveRoute(pathname, item.href) 
                  ? "text-primary-blue"
                  : "text-gray-900"
              )}
            >
              {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6">
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    <WalletIcon className="text-text-secondary" />
                    <span className="flex-1 text-left">
                      {shortenAddress(user?.wallet?.address ?? "")}
                    </span>
                    {isAddressCopied ? (
                      <CheckmarkIcon className="size-4 text-primary-blue" />
                    ) : (
                      <CopyIcon className="size-4 text-text-secondary" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={exportWallet}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    <PrivateKeyIcon className="text-text-secondary" />
                    <span>Export wallet</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    <LogoutIcon className="text-text-secondary" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
};
