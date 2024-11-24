"use client"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { DataTable } from "./transactions/deposits/components/data-table";
import { columns } from "./transactions/deposits/components/columns";
import { usePrivy } from "@privy-io/react-auth";


interface TransactionsTabProps {
  data: any;
}

export function TransactionsTab({ data }: TransactionsTabProps) {
  const deposits = data?.deposits || []
  const { user } = usePrivy();
const walletAddress = user?.wallet?.address;

const myDeposits = data?.deposits.filter(deposit => deposit.donor.address.toLowerCase() === walletAddress?.toLowerCase()) || [];


  return (
    <Tabs defaultValue="All transactions" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="All transactions">All transactions</TabsTrigger>
        <TabsTrigger value="My transactions">My transactions</TabsTrigger>
      </TabsList>
      <TabsContent value="All transactions">
        <Card>
          <CardContent className="space-y-2">
            <div className="pt-6">
              <DataTable data={deposits} columns={columns} />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="My transactions">
        <Card>
          <CardContent className="space-y-2">
            <div className="pt-6">
              <DataTable data={myDeposits} columns={columns} />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}