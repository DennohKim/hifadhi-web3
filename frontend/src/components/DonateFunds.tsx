"use client";

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

export function DonateFunds() {
  return (
    <Tabs defaultValue="contribute" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="contribute">Contribute</TabsTrigger>
        <TabsTrigger value="onramp">Onramp</TabsTrigger>
      </TabsList>
      <TabsContent value="contribute">
        <Card>
          <CardHeader>
            <CardTitle>Contribute</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Wallet Balance</Label>
            </div>
            <div className="space-y-1">
              <Label htmlFor="amount">Contribution Amount</Label>
              <Input id="amount" placeholder="$20"/>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 w-full">
            <Button variant="create" className="w-full">Contribute</Button>
            <Button variant="outline" className="w-full">Auto Contribute</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="onramp">
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
            <Button variant="create" className="w-full">Pay</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
