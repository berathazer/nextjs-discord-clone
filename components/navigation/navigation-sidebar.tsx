import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";

import NavigationAction from "@/components/navigation/navigation-action";
import NavigationItem from "@/components/navigation/navigation-item";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SignedIn, UserButton } from "@clerk/nextjs";

const NavigationSidebar = async () => {
	const profile = await currentProfile();

	if (!profile) {
		return redirect("/");
	}

	const servers = await db.server.findMany({
		where: {
			members: {
				some: {
					profileId: profile.id,
				},
			},
		},
	});

	return (
		<div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
			<NavigationAction />
			<Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
			<ScrollArea className="flex-1 w-full">
				{servers.map((server) => (
					<div key={server.id} className="mb-4">
						<NavigationItem id={server.id} name={server.name} imageUrl={server.imageUrl} />
					</div>
				))}
			</ScrollArea>

			<div className="pb-3 mt-auto flex items-center flex-col gap-y-4 z-[999]">
				<ModeToggle />
				<div className="z-[999] ">
					{/* Mount the UserButton component */}
					<UserButton
						afterSignOutUrl="/"
						appearance={{
							elements: {
								avatarBox: "h-12 w-12 ring-0",
							},
							userProfile: {
								elements: {
									modalContent: "bg-red-500",
								},
							},
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default NavigationSidebar;
