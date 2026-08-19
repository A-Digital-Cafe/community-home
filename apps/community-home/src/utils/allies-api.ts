import { createAdcApi } from "@ui-library/utils/adc-fetch";
import type { AllySort, CommunityAlly } from "@common/ADC/types/community.js";

export type { AllySort, CommunityAlly } from "@common/ADC/types/community.js";
export { ALLY_LIMITS, ALLY_PAGE_SIZE, isValidDiscordInvite } from "@common/ADC/types/community.js";

/** Vista de gestión: suma el ticket que originó el alta (no se sirve en la lista pública). */
export interface AdminAlly extends CommunityAlly {
	sourceTicketKey?: string;
}

export interface AllyPayload {
	name?: string;
	description?: string;
	inviteUrl?: string;
	visible?: boolean;
	sourceTicketKey?: string;
}

interface ListResponse {
	allies: CommunityAlly[];
	total: number;
	start: number;
	limit: number;
}

const api = createAdcApi({
	basePath: "/api/learning",
	devPort: 3000,
});

/** URL pública del logo, servido por content-service desde nuestro almacenamiento. */
export function allyLogoUrl(id: number): string {
	return `/api/learning/allies/${id}/logo/raw`;
}

export const alliesApi = {
	list: async (options: { sort: AllySort; limit: number; start: number }): Promise<ListResponse> => {
		const result = await api.get<ListResponse>("/allies", { params: options });
		return {
			allies: result.data?.allies ?? [],
			total: result.data?.total ?? 0,
			start: result.data?.start ?? 0,
			limit: result.data?.limit ?? options.limit,
		};
	},
};

export const alliesAdminApi = {
	list: async (): Promise<AdminAlly[]> => {
		const r = await api.get<{ allies: AdminAlly[] }>("/allies/admin");
		return r.data?.allies ?? [];
	},
	create: async (body: AllyPayload): Promise<AdminAlly | null> => {
		const r = await api.post<{ ally: AdminAlly }>("/allies", { body, idempotencyData: { action: "create-ally", ...body } });
		return r.data?.ally ?? null;
	},
	update: async (id: number, body: AllyPayload): Promise<AdminAlly | null> => {
		const r = await api.put<{ ally: AdminAlly }>(`/allies/${id}`, { body, idempotencyData: { action: "update-ally", id, ...body } });
		return r.data?.ally ?? null;
	},
	remove: async (id: number): Promise<boolean> => {
		const r = await api.delete<{ success: boolean }>(`/allies/${id}`, { idempotencyKey: `delete-ally:${id}` });
		return r.data?.success === true;
	},
};

interface LogoPresignResult {
	attachmentId: string;
	uploadUrl: string;
	headers: Record<string, string>;
}

export const allyLogoApi = {
	/** Sube el logo de una comunidad ya creada: presign → PUT a S3 → confirm. */
	upload: async (id: number, file: File): Promise<boolean> => {
		const presign = await api.post<LogoPresignResult>(`/allies/${id}/logo/presign-upload`, {
			body: { fileName: file.name, mimeType: file.type || "application/octet-stream", size: file.size },
			idempotencyKey: `ally-logo-presign:${id}:${file.size}:${Date.now()}`,
		});
		if (!presign.data) return false;
		const putRes = await fetch(presign.data.uploadUrl, { method: "PUT", body: file, headers: presign.data.headers });
		if (!putRes.ok) return false;
		const confirmed = await api.post<{ attachment: { id: string } }>(`/allies/${id}/logo/${presign.data.attachmentId}/confirm`, {
			idempotencyKey: `ally-logo-confirm:${id}:${presign.data.attachmentId}`,
		});
		return !!confirmed.data?.attachment?.id;
	},
	remove: async (id: number): Promise<boolean> => {
		const r = await api.delete<{ success: boolean }>(`/allies/${id}/logo`, { idempotencyKey: `ally-logo-del:${id}` });
		return r.data?.success === true;
	},
};
