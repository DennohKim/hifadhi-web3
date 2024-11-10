"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { AnimatedItem } from "./Animations"
import { TransactionHistory } from "./TransactionHistory"

export function TransactionsTab() {
  return (
    <Tabs defaultValue="All transactions" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="All transactions">All transactions</TabsTrigger>
        <TabsTrigger value="My transactions">My transactions</TabsTrigger>
      </TabsList>
      <TabsContent value="All transactions">
        <Card>
          <CardContent className="space-y-2">
          <div>
            <TransactionHistory transactions={[]} />
           </div>
          </CardContent>
         
        </Card>
      </TabsContent>
      <TabsContent value="My transactions">
        <Card>
          <CardContent className="space-y-2">
           <div>
            <TransactionHistory transactions={[]} />
           </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
