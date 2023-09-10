"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import qs from "query-string";
import { useRouter } from "next/navigation";

import axios from "axios";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useModal } from "@/hooks/use-modal-store";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChannelType } from "@prisma/client";
import { useEffect } from "react";

const formSchema = z.object({
	name: z
		.string()
		.min(1, { message: "Channel name is required" })
		.refine((name) => name !== "general", { message: "Channel name cannot be 'general'" }),
	type: z.nativeEnum(ChannelType),
});

const EditChannelModal = () => {
	const router = useRouter();
	const { type, isOpen, onClose, data } = useModal();

	const isModalOpen = isOpen && type === "editChannel";
	const { server, channelType, channel } = data;

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			type: channel?.type || ChannelType.TEXT,
		},
	});

	useEffect(() => {
		if (channel) {
			form.setValue("name", channel.name);
			form.setValue("type", channel.type);
		} else {
			form.setValue("type", ChannelType.TEXT);
		}
	}, [channelType, form, channel]);

	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const url = qs.stringifyUrl({
				url: `/api/channels/${channel?.id}`,
				query: {
					serverId: server?.id,
				},
			});
			await axios.patch(url, values);
			form.reset();
			router.refresh();
			onClose();
		} catch (error) {
			console.log(error);
		}
	};

	const handleClose = () => {
		form.reset();
		onClose();
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			{/* 	<DialogTrigger asChild>
					<Button variant="outline">Edit Profile</Button>
				</DialogTrigger> */}
			<DialogContent className="sm:max-w-[425px] bg-light text-black">
				<DialogHeader className="py-4">
					<DialogTitle className="text-center text-lg">Edit channel</DialogTitle>
					<DialogDescription className="text-zinc-500">Give your server a personality with a name and an image. You can always change it later</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="space-y-8">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">Channel name</FormLabel>
										<FormControl>
											<Input
												disabled={isLoading}
												placeholder="Enter channel name"
												className=" bg-zinc-300/50 border-0 font-medium focus-visible:ring-0 text-black focus-visible:ring-offset-0"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">Channel name</FormLabel>
										<Select name="type" disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger className=" bg-zinc-300/50 border-0 font-medium focus-visible:ring-0 text-black focus-visible:ring-offset-0">
													<SelectValue placeholder="Select channel type" className="focus-visible:ring-0 focus-visible:ring-offset-0" />
												</SelectTrigger>
											</FormControl>
											<SelectContent className="focus-visible:ring-0 focus-visible:ring-offset-0">
												<SelectGroup className="focus-visible:ring-0 focus-visible:ring-offset-0">
													{Object.values(ChannelType).map((channel) => (
														<SelectItem key={channel} value={channel}>
															{channel}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>

										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter>
							<Button variant={"secondary"} type="submit" className="w-full">
								Save Changes
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default EditChannelModal;
