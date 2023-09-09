"use client";

import { ShieldAlert, ShieldCheck, MoreVertical, ShieldQuestion, Shield, Check, Gavel, Loader2 } from "lucide-react";
import { useState } from "react";
import qs from "query-string";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserAvatar from "@/components/user-avatar";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuLabel,
	DropdownMenuSub,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownMenuSubTrigger,
	DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { MemberRole } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";

const roleIconMap = {
	GUEST: null,
	MODERATOR: <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />,
	ADMIN: <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />,
};

const MembersModal = () => {
	const router = useRouter();
	const { type, isOpen, onClose, data, onOpen } = useModal();
	const [loadingId, setLoadingId] = useState("");
	const { server } = data as { server: ServerWithMembersWithProfiles };

	const isModalOpen = isOpen && type === "members";

	const onRoleChange = async (memberId: string, role: MemberRole) => {
		try {
			setLoadingId(memberId);
			const url = qs.stringifyUrl({
				url: `/api/members/${memberId}`,
				query: {
					serverId: server?.id,
				},
			});

			const res = await axios.patch(url, { role });
			router.refresh();
			onOpen("members", { server: res.data });
		} catch (error) {
			console.log("onRoleChangeError:", error);
		} finally {
			setLoadingId("");
		}
	};

	const onKick = async (memberId: string) => {
		try {
			setLoadingId(memberId);
			const url = qs.stringifyUrl({
				url: `/api/members/${memberId}`,
				query: {
					serverId: server?.id,
				},
			});

			const res = await axios.delete(url);
			router.refresh();
			onOpen("members", { server: res.data });
		} catch (error) {
			console.log("onKickError:", error);
		} finally {
			setLoadingId("");
		}
	};
	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			{/* 	<DialogTrigger asChild>
					<Button variant="outline">Edit Profile</Button>
				</DialogTrigger> */}
			<DialogContent className="sm:max-w-[425px] bg-light text-black">
				<DialogHeader className="py-4">
					<DialogTitle className="text-center text-lg">Manage Members</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">{server?.members?.length} Members</DialogDescription>
				</DialogHeader>

				<ScrollArea className="mt-8 max-h-[420px] pr-6">
					{server?.members?.map((member) => (
						<div key={member.id} className="flex items-center gap-x-2 mb-6">
							<UserAvatar src={member.profile.imageUrl} />
							<div className="flex flex-col gap-y-1">
								<div className="text-xs font-semibold flex items-center gap-x-1">
									{member.profile.name}
									{roleIconMap[member.role]}
								</div>
								<p className="text-xs text-zinc-500">{member.profile.email}</p>
							</div>
							{server.profileId !== member.profileId && loadingId !== member.id && (
								<div className="ml-auto">
									<DropdownMenu>
										<DropdownMenuTrigger>
											<MoreVertical className="w-4 h-4 text-zinc-500" />
										</DropdownMenuTrigger>

										<DropdownMenuContent side="right">
											<DropdownMenuSub>
												<DropdownMenuSubTrigger className="flex items-center">
													<ShieldQuestion className="w-4 h-4 mr-2" />
													<span>Role</span>
												</DropdownMenuSubTrigger>
												<DropdownMenuPortal>
													<DropdownMenuSubContent>
														<DropdownMenuItem onClick={() => onRoleChange(member.id, "GUEST")}>
															<Shield className="w-4 h-4 mr-2" />
															Guest
															{member.role === "GUEST" && <Check className="w-4 h-4 ml-auto" />}
														</DropdownMenuItem>

														<DropdownMenuItem onClick={() => onRoleChange(member.id, "MODERATOR")}>
															<ShieldCheck className="w-4 h-4 mr-2" />
															Moderator
															{member.role === "MODERATOR" && <Check className="w-4 h-4 ml-auto" />}
														</DropdownMenuItem>
													</DropdownMenuSubContent>
												</DropdownMenuPortal>
											</DropdownMenuSub>
											<DropdownMenuSeparator />
											<DropdownMenuItem onClick={() => onKick(member.id)} className="flex items-center ">
												<Gavel className="w-4 h-4 mr-2 text-rose-300" />
												Kick
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							)}
							{loadingId === member.id && <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />}
						</div>
					))}
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};

export default MembersModal;
