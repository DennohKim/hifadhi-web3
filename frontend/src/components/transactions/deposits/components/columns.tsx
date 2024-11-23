"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Transaction } from "../data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { shortenAddress, formatDate } from "@/lib/utils"
import Link from "next/link"
import { ExternalLinkIcon } from "@/components/ImageAssets"

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "donor",
    header: "Contributors",
    cell: ({ row }) => {
      
      const donor = row.original.donor
      return (
        <div
        
          className="flex items-center gap-2"
        >
         
          <span className="text-xs">{shortenAddress(donor.address)}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = (Number(row.original.amount) / 10**6).toLocaleString('en-US')
      return <div className="text-xs">$ {amount}</div>
    },
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Timestamp" />
    ),
    cell: ({ row }) => {
      return <div className="text-xs">{formatDate(new Date(Number(row.original.timestamp) * 1000))}</div>
    },
  },
  {
    accessorKey: "transactionHash",
    header: "Transaction Hash",
    cell: ({ row }) => {
      return (
        <Link
          href={`https://sepolia.basescan.org/tx/${row.original.transactionHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs"
        >
          View
          <ExternalLinkIcon className="size-4" />
        </Link>
      )
    },
  },
]