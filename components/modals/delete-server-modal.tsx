"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";

import { Button } from "@/components/ui/button";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { Input } from "../ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const DeleteServerModal = () => {
	const { type, isOpen, onClose, data } = useModal();
	const router = useRouter();
	const { server } = data;

	const formSchema = z.object({
		name: z
			.string()
			.min(1, { message: "Server name is required" })
			.refine((name) => name === server?.name, { message: "You didn't enter the server name correctly!" }),
	});

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
		},
	});

	const [isLoading, setIsLoading] = useState(false);

	const isModalOpen = isOpen && type === "deleteServer";

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			setIsLoading(true);
			const res = await axios.delete(`/api/servers/${server?.id}/delete`);
			onClose();
			router.refresh();
			router.push("/");
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			{/* 	<DialogTrigger asChild>
					<Button variant="outline">Edit Profile</Button>
				</DialogTrigger> */}
			<DialogContent className="sm:max-w-[425px] bg-light  text-black">
				<DialogHeader className="p-0">
					<DialogTitle className="text-xl">Delete {`'${server?.name}'`}</DialogTitle>
					<DialogDescription className="text-primary text-sm p-2 bg-amber-500 rounded-md">
						Are you sure you want to delete <strong>{server?.name}</strong>? {`This action cannot be undone.`}
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col focus-within:ring-0 focus-within:ring-offset-0">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-zinc-500 ">Enter Server name</FormLabel>
										<FormControl>
											<Input
												disabled={isLoading}
												placeholder="Enter your server name"
												className=" bg-zinc-300/50 border-0 font-medium focus-visible:ring-0 text-black focus-visible:ring-offset-0"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<DialogFooter className="pt-4">
								<Button disabled={isLoading} type="button" onClick={onClose} variant={"ghost"}>
									Cancel
								</Button>
								<Button disabled={isLoading} type="submit" variant={"destructive"}>
									Delete Server
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteServerModal;
