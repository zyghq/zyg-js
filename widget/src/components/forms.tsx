import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { NavigateFn } from "@tanstack/react-router";
import { createThreadAPI, addEmailProfileAPI } from "@/api";

const startThreadFormSchema = z.object({
  message: z.string().min(2, {
    message: "Must be at least 2 characters",
  }),
});

type StartThreadFormValues = z.infer<typeof startThreadFormSchema>;

const emailProfileFormSchema = z.object({
  email: z.string().email({ message: "Must be valid email address" }),
  name: z.string().min(3, {
    message: "Must be at least 3 characters",
  }),
  redirectHost: z.string().optional(),
  contextThreadId: z.string().optional(),
});

type EmailProfileFormValues = z.infer<typeof emailProfileFormSchema>;

function SubmitButton({ isDisabled }: { isDisabled: boolean }) {
  return (
    <Button
      className="w-full"
      type="submit"
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-label="Send Message"
    >
      Send
    </Button>
  );
}

export function StartThreadWithEmailProfileForm({
  widgetId,
  jwt,
  navigate,
}: {
  widgetId: string;
  jwt: string;
  navigate: NavigateFn;
}) {
  const threadForm = useForm({
    resolver: zodResolver(startThreadFormSchema),
    defaultValues: {
      message: "",
    },
    mode: "onBlur",
  });

  const profileForm = useForm({
    resolver: zodResolver(emailProfileFormSchema),
    defaultValues: {
      email: "",
      name: "",
      redirectHost: "",
      contextThreadId: "",
    },
    mode: "onBlur",
  });

  const { formState: threadFormState } = threadForm;
  const { isSubmitting: threadIsSubmitting, errors: threadErrors } =
    threadFormState;

  const { formState: profileFormState } = profileForm;
  const { isSubmitting: profileIsSubmitting, errors: profileErrors } =
    profileFormState;

  const onThreadSubmit: SubmitHandler<StartThreadFormValues> = async (
    values
  ) => {
    const { message } = values;
    const response = await createThreadAPI(widgetId, jwt, {
      message,
    });
    const { error, data } = response;
    if (error) {
      const { message } = error;
      threadForm.setError("root.serverError", {
        message: message || "Please try again later.",
      });
      return;
    }
    if (data) {
      const { threadId } = data;
      profileForm.setValue("contextThreadId", threadId);
      profileForm.handleSubmit(onEmailProfileSubmit)();
    } else {
      threadForm.setError("root.serverError", {
        message: "Something went wrong. Please try again later.",
      });
    }
  };

  const onEmailProfileSubmit: SubmitHandler<EmailProfileFormValues> = async (
    values
  ) => {
    console.log("*** data for profile form ***", values);

    //   await navigate({ to: `/threads/$threadId`, params: { threadId } });
  };

  const onEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  const isDisabled = threadIsSubmitting || profileIsSubmitting;

  return (
    <div className="flex flex-col gap-2">
      <Form {...profileForm}>
        <form onSubmit={() => {}} className="flex flex-col gap-2">
          <FormField
            control={profileForm.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2 w-full">
                <FormControl>
                  <Input
                    autoFocus
                    placeholder="you@example.com"
                    title="Email"
                    required
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {profileErrors.email && (
            <p className="text-xs text-red-500" role="alert">
              {profileErrors.email?.message}
            </p>
          )}
          <FormField
            control={profileForm.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-2 w-full">
                <FormControl>
                  <Input placeholder="Name" title="Name" required {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          {profileErrors.email && (
            <p className="text-xs text-red-500" role="alert">
              {profileErrors.name?.message}
            </p>
          )}
        </form>
      </Form>
      <Form {...threadForm}>
        <form
          onSubmit={threadForm.handleSubmit(onThreadSubmit)}
          className="flex flex-col gap-2"
        >
          <FormField
            control={threadForm.control}
            name="message"
            disabled={false}
            render={({ field }) => (
              <FormItem className="space-y-2 w-full">
                <FormControl>
                  <Textarea
                    className="resize-none"
                    placeholder="Send us a message"
                    title="Send us a message"
                    required
                    {...field}
                    onKeyDown={onEnterPress}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {threadErrors.message && (
            <p className="text-xs text-red-500" role="alert">
              {threadErrors.message?.message}
            </p>
          )}
          <SubmitButton isDisabled={isDisabled} />
        </form>
        {threadErrors?.root?.serverError && (
          <FormMessage className="text-xs">
            {threadErrors?.root?.serverError?.message}
          </FormMessage>
        )}
        {profileErrors?.root?.serverError && (
          <FormMessage className="text-xs">
            {profileErrors?.root?.serverError?.message}
          </FormMessage>
        )}
      </Form>
    </div>
  );
}
