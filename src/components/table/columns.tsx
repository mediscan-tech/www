"use client"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

export const columns: any = [
  {
    accessorKey: "facility_name",
    header: "Hospital Name",
  },
  {
    accessorKey: "formattedAddress",
    header: "Address",
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
        return <div className="font-medium text-right">{formatted}</div>
      } else {
        formatted = Number(formatted)
        return <div className="font-medium text-right">{formatted} minutes</div>
      }
       
    },
  },
]
