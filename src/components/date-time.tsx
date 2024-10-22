"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  datetime: z.date({
    required_error: "Date & time is required!",
  }),
});

const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// Accept props for handling date changes
interface DateTimePickerProps {
  onDateChange: (date: Date) => void;
  selectedDate: Date | null;
  selectedDoctor: { clerk_id: string; name: string } | null;
}

export function DateTimePickerV2({
  onDateChange,
  selectedDate,
  selectedDoctor,
}: DateTimePickerProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState<string>("05:00");
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!user || !selectedDoctor) {
      toast({
        title: "Error! ❌",
        description: "User or doctor information is missing",
        variant: "destructive",
      });
      return;
    }

    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    try {
      const response = await fetch("/api/telemedicineDate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientClerkId: user.id,
          doctorClerkId: selectedDoctor.clerk_id,
          meetingDateTime: data.datetime.toLocaleString("en-US", {
            timeZone: userTimeZone,
          }),
          timeZone: userTimeZone,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success! 🎉",
          description: `Meeting scheduled with ${
            selectedDoctor.name
          } at: ${format(data.datetime, "PPP, p")}`,
          duration: 10000,
        });
        // Automatically redirect to /directory after a short delay
        setTimeout(() => {
          router.push("/directory");
        }, 2000); // Adjust the delay as needed (2000ms = 2 seconds)
      } else {
        toast({
          title: "Error! ❌",
          description: "Failed to schedule meeting. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      toast({
        title: "Error! ❌",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex w-full gap-4">
            <FormField
              control={form.control}
              name="datetime"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "mr-2 w-full font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            `${format(field.value, "PPP")}`
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        captionLayout="dropdown"
                        selected={selectedDate || field.value}
                        onSelect={(selectedDate) => {
                          if (selectedDate) {
                            const [hours, minutes] = time.split(":");
                            selectedDate.setHours(
                              parseInt(hours),
                              parseInt(minutes)
                            );
                            field.onChange(selectedDate);
                            onDateChange(selectedDate); // Call onDateChange to update the selected date
                            setIsOpen(false);
                          }
                        }}
                        onDayClick={() => setIsOpen(false)}
                        fromYear={2000}
                        toYear={new Date().getFullYear()}
                        disabled={(date) =>
                          Number(date) < Date.now() - 1000 * 60 * 60 * 24 ||
                          Number(date) > Date.now() + 1000 * 60 * 60 * 24 * 30
                        }
                        defaultMonth={field.value}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Set your date and time.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="datetime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={time}
                      onValueChange={(e) => {
                        setTime(e);
                        if (field.value) {
                          const [hours, minutes] = e.split(":");
                          const newDate = new Date(field.value.getTime());
                          newDate.setHours(parseInt(hours), parseInt(minutes));
                          field.onChange(newDate);
                          onDateChange(newDate); // Call onDateChange to update the selected date
                        }
                      }}
                    >
                      <SelectTrigger className="w-[120px] font-normal focus:ring-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <ScrollArea className="h-[15rem]">
                          {Array.from({ length: 96 }).map((_, i) => {
                            const hour = Math.floor(i / 4)
                              .toString()
                              .padStart(2, "0");
                            const minute = ((i % 4) * 15)
                              .toString()
                              .padStart(2, "0");
                            return (
                              <SelectItem
                                key={i}
                                value={`${hour}:${minute}`}
                                className="text-black"
                              >
                                {" "}
                                {/* Set text color to black */}
                                {hour}:{minute}
                              </SelectItem>
                            );
                          })}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">Schedule Meeting</Button>
        </form>
      </Form>
    </>
  );
}
