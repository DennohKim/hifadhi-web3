import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { format } from "date-fns";
import type { InstitutionProps } from "./types";
import { formatUnits } from "viem";

/**
 * Concatenates and returns a string of class names.
 *
 * @param classes - The class names to concatenate.
 * @returns A string of concatenated class names.
 */
export function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

/**
 * Shortens the given address by replacing the middle characters with ellipsis.
 * @param address - The address to be shortened.
 * @param startChars - The number of characters to keep at the beginning of the address. Default is 4.
 * @param endChars - The number of characters to keep at the end of the address. Default is the same as startChars.
 * @returns The shortened address.
 */
export function shortenAddress(
	address: string,
	startChars = 4,
	endChars = startChars,
): string {
	if (address.length <= startChars + endChars) {
		return address;
	}
	return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Pauses the execution for a specified number of milliseconds.
 *
 * @param ms - The number of milliseconds to sleep. If undefined, the function will not pause.
 * @returns A promise that resolves after the specified time has elapsed.
 */
export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retrieves the institution name based on the provided institution code.
 *
 * @param code - The institution code.
 * @returns The institution name associated with the provided code, or undefined if not found.
 */
export function getInstitutionNameByCode(
	code: string,
	supportedInstitutions: InstitutionProps[],
): string | undefined {
	const institution = supportedInstitutions.find((inst) => inst.code === code);
	return institution ? institution.name : undefined;
}

/**
 * Formats a number as a currency string.
 *
 * @param value - The number to format.
 * @param currency - The currency code to use.
 * @param locale - The locale to use, e.g., "en-US".
 * @returns The formatted currency string.
 */
export const formatCurrency = (
	value: number,
	currency: string,
	locale: string,
) => {
	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency,
	}).format(value);
};

/**
 * Formats a given date string, number, or Date object into a specific string format.
 *
 * @param dateString - The date to format, which can be a string, number, or Date object.
 * @returns A formatted date string in the format "dd MMM, yyyy HH:mm.
 */
export const formatDate = (dateString: string | number | Date) => {
	const date = new Date(dateString);
	return format(date, "dd, MMM yyyy HH:mm");
};

/**
 * Returns a human-readable relative time string based on the difference between the given date and the current date.
 *
 * @param date - The date to compare with the current date.
 * @returns A string representing the relative time difference. Possible values include:
 * - "Today"
 * - "Yesterday"
 * - "X days ago" (where X is the number of days less than 7)
 * - "One week ago"
 * - "One month ago"
 * - "X months ago" (where X is the number of months less than 12)
 * - "One year ago"
 * - "X years ago" (where X is the number of years less than 5)
 * - "A long time ago"
 */
export const getRelativeTimeString = (date: Date): string => {
	const now = new Date();
	const diffTime = Math.abs(now.getTime() - date.getTime());
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	const diffMonths = Math.floor(diffDays / 30);
	const diffYears = Math.floor(diffDays / 365);

	if (diffDays === 0) return "Today";
	if (diffDays === 1) return "Yesterday";
	if (diffDays < 7) return `${diffDays} days ago`;
	if (diffDays < 30) return "One week ago";
	if (diffMonths === 1) return "One month ago";
	if (diffMonths < 12) return `${diffMonths} months ago`;
	if (diffYears === 1) return "One year ago";
	if (diffYears < 5) return `${diffYears} years ago`;
	return "A long time ago";
};

/**
 * Removes trailing zeros from a string representation of a number.
 * @param value - The string representation of the number.
 * @returns The string representation of the number with trailing zeros removed.
 */
export function stripTrailingZeros(value: string): string {
	const parts = value.toString().split(".");
	const decimalPart = parts.length > 1 ? parts[1].replace(/0+$/, "") : "";
	return `${parts[0]}.${decimalPart}`.replace(/\.$/, "");
}

/**
 * Returns the explorer link for a given transaction hash based on the network and status.
 * @param network - The network name.
 * @param txHash - The transaction hash.
 * @param status - The status of the transaction.
 * @returns The explorer link for the transaction.
 */
export const getExplorerLink = (
	network: string,
	txHash: string,
): string | undefined => {
	const explorers: { [key: string]: string } = {
		polygon: "https://polygonscan.com/tx/",
		"bnb-smart-chain": "https://bscscan.com/tx/",
		base: "https://basescan.org/tx/",
		"arbitrum-one": "https://arbiscan.io/tx/",
		ethereum: "https://etherscan.io/tx/",
		"ethereum-sepolia": "https://sepolia.etherscan.io/tx/",
		"arbitrum-sepolia": "https://sepolia.arbiscan.io/tx/",
		tron: "https://tronscan.org/#/transaction/",
		"tron-shasta": "https://shasta.tronscan.org/#/transaction/",
		"base-sepolia": "https://sepolia.basescan.org/tx/",
	};

	return explorers[network] ? `${explorers[network]}${txHash}` : undefined;
};

/**
 * Formats a number with commas and removes trailing zeros.
 * @param value - The number to format.
 * @returns The formatted number with commas and no trailing zeros.
 */
export const formatNumberWithCommas = (value: string | number): string => {
	// Convert to string and handle null/undefined
	const numStr = String(value || '0');
	
	// Split number into integer and decimal parts
	const [integerPart, decimalPart] = numStr.split('.');
	
	// Add commas to integer part
	const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	
	// Combine with decimal part if it exists
	if (decimalPart !== undefined) {
	  // Remove trailing zeros from decimal part
	  const cleanDecimal = decimalPart.replace(/0+$/, '');
	  return cleanDecimal ? `${formattedInteger}.${cleanDecimal}` : formattedInteger;
	}
	
	return formattedInteger;
  };


//   export const formatUSDC = (value: bigint | number, options?: Intl.NumberFormatOptions) => {
// 	const defaultOptions = {
// 	  style: 'currency',
// 	  currency: 'USD',
// 	  minimumFractionDigits: 2,
// 	  maximumFractionDigits: 2,
// 	  ...options
// 	};
	
// 	// Convert from USDC's 6 decimals to a regular number
// 	const normalizedValue = Number(value) / 10 ** 6;
	
// 	return new Intl.NumberFormat('en-US', defaultOptions).format(normalizedValue);
//   };
  
//   export const parseUSDCInput = (value: string): bigint => {
// 	// Convert user input (e.g., "1000.50") to USDC units (with 6 decimals)
// 	const parsed = parseFloat(value);
// 	return BigInt(Math.round(parsed * 10 ** 6));
// };


export const formatUSDC = (value: bigint | string | number): string => {
	if (!value) return "$0.00";
	
	// Convert to BigInt if not already
	const bigIntValue = typeof value === 'string' ? BigInt(value) : BigInt(value.toString());
	
	// Use formatUnits from viem for consistent decimal handling
	const formatted = formatUnits(bigIntValue, 6);
	
	return `$${Number(formatted).toLocaleString("en-US", {
	  minimumFractionDigits: 2,
	  maximumFractionDigits: 2
	})}`;
  };
