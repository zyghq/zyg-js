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
import {
  createThreadAPI,
  sendThreadMessageAPI,
  getCustomerAPI,
} from "@zyg-js/core";
import { useMutation } from "@tanstack/react-query";
import { useStore } from "zustand";
import { useWidgetStore } from "@/components/providers";

const threadWithProfileFormSchema = z.object({
  message: z.string().min(2, {
    message: "Must be at least 2 characters",
  }),
  email: z.string().email({ message: "Must be valid email address" }),
  name: z.string().min(3, {
    message: "Must be at least 3 characters",
  }),
});

type ThreadFormWithProfileValue = z.infer<typeof threadWithProfileFormSchema>;

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
  const widgetStore = useWidgetStore();
  const actions = useStore(widgetStore, (state) => state.actions);
  const form = useForm({
    resolver: zodResolver(threadWithProfileFormSchema),
    defaultValues: {
      message: "",
      email: "",
      name: "",
    },
    mode: "onChange",
  });

  const { formState } = form;
  const { isSubmitting, errors } = formState;

  const customerRefresh = useMutation({
    mutationFn: async function () {
      const { error, data } = await getCustomerAPI(widgetId, jwt);
      if (error) {
        console.error(error);
        throw new Error("error fetching customer");
      }
      if (data) {
        console.log(data);
        return data;
      }
      return null;
    },
    onSuccess: (data) => {
      if (data) {
        const customer = {
          customerId: data.customerId,
          email: data.email,
          externalId: data.externalId,
          name: data.name,
          isEmailVerified: data.isEmailVerified,
          isEmailPrimary: data.isEmailPrimary,
          phone: data.phone,
          avatarUrl: data.avatarUrl,
          role: data.role,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
        actions.setCustomer(customer);
      }
    },
    onError: () => {},
  });

  const onThreadSubmit: SubmitHandler<ThreadFormWithProfileValue> = async (
    values
  ) => {
    const { message, email, name } = values;
    const body = {
      message,
      email,
      name,
    };
    const response = await createThreadAPI(widgetId, jwt, body);
    const { error, data } = response;
    if (error) {
      const { message } = error;
      form.setError("root.serverError", {
        message: message || "Please try again later.",
      });
      return;
    }
    if (data) {
      const { threadId } = data;
      await customerRefresh.mutateAsync();
      await navigate({
        to: `/threads/$threadId`,
        params: { threadId },
      });
    } else {
      form.setError("root.serverError", {
        message: "Something went wrong. Please try again later.",
      });
    }
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

  const isDisabled = isSubmitting;

  return (
    <div className="flex flex-col gap-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onThreadSubmit)}
          className="flex flex-col gap-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
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
          {errors.email && (
            <p className="text-xs text-red-500" role="alert">
              {errors.email?.message}
            </p>
          )}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input placeholder="Name" title="Name" required {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          {errors.email && (
            <p className="text-xs text-red-500" role="alert">
              {errors.name?.message}
            </p>
          )}
          <FormField
            control={form.control}
            name="message"
            disabled={false}
            render={({ field }) => (
              <FormItem className="w-full">
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
          {errors.message && (
            <p className="text-xs text-red-500" role="alert">
              {errors.message?.message}
            </p>
          )}
          <SubmitButton isDisabled={isDisabled} />
        </form>
        {errors?.root?.serverError && (
          <FormMessage className="text-xs">
            {errors?.root?.serverError?.message}
          </FormMessage>
        )}
      </Form>
    </div>
  );
}

const startThreadFormSchema = z.object({
  message: z.string().min(2, {
    message: "Must be at least 2 characters",
  }),
});

type StartThreadFormValues = z.infer<typeof startThreadFormSchema>;

export function StartThreadForm({
  widgetId,
  jwt,
  navigate,
}: {
  widgetId: string;
  jwt: string;
  navigate: NavigateFn;
}) {
  const form = useForm({
    resolver: zodResolver(startThreadFormSchema),
    defaultValues: {
      message: "",
    },
    mode: "onChange",
  });

  const { formState } = form;
  const { isSubmitting, errors } = formState;

  const onEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  const onSubmit: SubmitHandler<StartThreadFormValues> = async (values) => {
    const { message } = values;
    const response = await createThreadAPI(widgetId, jwt, {
      message,
    });
    const { error, data } = response;
    if (error) {
      const { message } = error;
      form.setError("root.serverError", {
        message: message || "Please try again later.",
      });
      return;
    }
    if (data) {
      const { threadId } = data;
      await navigate({ to: `/threads/$threadId`, params: { threadId } });
    } else {
      form.setError("root.serverError", {
        message: "Something went wrong. Please try again later.",
      });
    }
  };

  const isDisabled = isSubmitting;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        <FormField
          control={form.control}
          name="message"
          disabled={false}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Textarea
                  className="resize-none"
                  placeholder="Send us a message"
                  title="Send us a message"
                  required
                  autoFocus
                  {...field}
                  onKeyDown={onEnterPress}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {errors.message && (
          <p className="text-xs text-red-500" role="alert">
            {errors.message?.message}
          </p>
        )}
        <SubmitButton isDisabled={isDisabled} />
      </form>
      {errors?.root?.serverError && (
        <FormMessage className="text-xs">
          {errors?.root?.serverError?.message}
        </FormMessage>
      )}
    </Form>
  );
}

const messageSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

type MessageFormValue = z.infer<typeof messageSchema>;

export function MessageThreadForm({
  disabled,
  widgetId,
  threadId,
  jwt,
  refetch,
}: {
  disabled: boolean;
  widgetId: string;
  threadId: string;
  jwt: string;
  refetch: () => void;
}) {
  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    },
  });

  const { formState } = form;
  const { isSubmitting, errors } = formState;

  const onEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  const onSubmit: SubmitHandler<MessageFormValue> = async (values) => {
    const { message } = values;
    const { error } = await sendThreadMessageAPI(widgetId, threadId, jwt, {
      message,
    });
    if (error) {
      const { message } = error;
      form.setError("root.serverError", {
        message: message || "Please try again later.",
      });
      return;
    }
    form.reset({ message: "" });
    refetch();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-between items-center gap-2"
      >
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="space-y-2 w-full">
              <FormControl>
                <Textarea
                  disabled={disabled}
                  className="resize-none"
                  placeholder="Send us a message"
                  title="Send us a message"
                  required
                  {...field}
                  onKeyDown={onEnterPress}
                />
              </FormControl>
              {errors?.root?.serverError && (
                <FormMessage>{errors?.root?.serverError?.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        <SubmitButton isDisabled={isSubmitting || disabled} />
      </form>
    </Form>
  );
}
