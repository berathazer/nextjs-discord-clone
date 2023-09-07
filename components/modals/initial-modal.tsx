"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

const formSchema = z.object({
	name: z.string().min(1, { message: "Server name is required" }),
	imageUrl: z.string().min(1, { message: "Server image is required" }),
});

const InitialModal = () => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			imageUrl: "",
		},
	});
	const isLoading = form.formState.isSubmitting;

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		console.log("form:", values);
	};

	if (!isMounted) {
		return null;
	}

	return (
		<Dialog open>
			{/* 	<DialogTrigger asChild>
					<Button variant="outline">Edit Profile</Button>
				</DialogTrigger> */}
			<DialogContent className="sm:max-w-[425px] bg-light text-black">
				<DialogHeader className="py-4">
					<DialogTitle className="text-center text-lg">Customize your server</DialogTitle>
					<DialogDescription className="text-zinc-500">Give your server a personality with a name and an image. You can always change it later</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="space-y-8">
							<div className=" flex items-center justify-center">TODO: image upload</div>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">Server name</FormLabel>
										<FormControl>
											<Input
												disabled={isLoading}
												placeholder="Enter server name"
												className=" bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter>
							<Button variant={"secondary"} type="submit">
								Create
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default InitialModal;
