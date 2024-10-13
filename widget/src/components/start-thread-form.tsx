// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { SendHorizonalIcon } from "lucide-react";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormMessage,
// } from "@/components/ui/form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm, SubmitHandler } from "react-hook-form";
// import { z } from "zod";
// import { createThreadAPI } from "@/api";
// import { NavigateFn } from "@tanstack/react-router";

// const formSchema = z.object({
//   message: z.string().min(1, "Message is required"),
// });

// type FormValues = {
//   message: string;
// };

// function SubmitButton({ isDisabled }: { isDisabled: boolean }) {
//   return (
//     <Button
//       className="ml-1"
//       size="icon"
//       type="submit"
//       disabled={isDisabled}
//       aria-disabled={isDisabled}
//       aria-label="Send Message"
//     >
//       <SendHorizonalIcon className="h-4 w-4" />
//     </Button>
//   );
// }
