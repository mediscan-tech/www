"use client"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button"
import Link from 'next/link'

export const columns: any = [
  {
    accessorKey: "facility_name",
    header: "Hospital Name",
  },
  {
    accessorKey: "directions",
    header: "Directions to Hospital",
    cell: ({ row }) => {
      let url:any = row.getValue("directions")
      return (
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href={url} target="_blank">Get Directions</Link>
          </Button>
        </div>
      )
    },
  },
  {
    accessorKey: "score",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Estimated Wait Time
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      )
    },
    cell: ({ row }) => {
      let formatted = row.getValue("score")
      if (formatted === "Not Available") {
        return <div>{formatted}</div>
      } else {
        formatted = Number(formatted)
        return <div>{formatted} minutes</div>
      }
       
    },
  },
  {
    accessorKey: "formattedAddress",
    header: "Address",
  },
]
