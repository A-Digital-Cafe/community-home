import "@ui-library/utils/react-jsx";
import { useEffect, useState } from "react";
import { AdminGate } from "../../components/admin/AdminGate";
import { ConfirmModal } from "../../components/ConfirmModal";
import {
	ALLY_LIMITS,
	alliesAdminApi,
	allyLogoApi,
	allyLogoUrl,
	isValidDiscordInvite,
	type AdminAlly,
	type AllyPayload,
} from "../../utils/allies-api";

interface FormState {
	name: string;
	description: string;
	inviteUrl: string;
	visible: boolean;
	sourceTicketKey: string;
}

function initialForm(a?: AdminAlly | null): FormState {
	return {
		name: a?.name ?? "",
		description: a?.description ?? "",
		inviteUrl: a?.inviteUrl ?? "",
		visible: a?.visible !== false,
		sourceTicketKey: a?.sourceTicketKey ?? "",
	};
}

function AlliesAdminBody() {
	const [allies, setAllies] = useState<AdminAlly[]>([]);
	const [editing, setEditing] = useState<AdminAlly | null>(null);
	const [form, setForm] = useState<FormState>(initialForm());
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [logoBusy, setLogoBusy] = useState(false);
	const [logoVersion, setLogoVersion] = useState(0);
	const [confirmDelete, setConfirmDelete] = useState<AdminAlly | null>(null);
	const [deleting, setDeleting] = useState(false);

	useEffect(() => {
		refresh();
	}, []);

	async function refresh() {
		setAllies(await alliesAdminApi.list());
	}

	function startEdit(ally: AdminAlly) {
		setEditing(ally);
		setForm(initialForm(ally));
		setError(null);
		setLogoVersion((v) => v + 1);
	}

	function resetForm() {
		setEditing(null);
		setForm(initialForm());
		setError(null);
	}

	async function handleSubmit(ev: React.SubmitEvent) {
		ev.preventDefault();
		if (!isValidDiscordInvite(form.inviteUrl.trim())) {
			setError("La invitación tiene que ser un enlace https de Discord (discord.gg/… o discord.com/invite/…).");
			return;
		}
		setError(null);
		setSaving(true);
		try {
			const payload: AllyPayload = {
				name: form.name.trim(),
				description: form.description.trim(),
				inviteUrl: form.inviteUrl.trim(),
				visible: form.visible,
				sourceTicketKey: form.sourceTicketKey.trim() || undefined,
			};
			const saved = editing ? await alliesAdminApi.update(editing.id, payload) : await alliesAdminApi.create(payload);
			if (saved) {
				await refresh();
				// Tras crear se queda en edición: el logo sólo se puede subir sobre una comunidad ya creada.
				if (editing) resetForm();
				else startEdit(saved);
			}
		} finally {
			setSaving(false);
		}
	}

	async function handleLogoUpload(ev: React.ChangeEvent<HTMLInputElement>) {
		const file = ev.target.files?.[0];
		ev.target.value = "";
		if (!file || !editing) return;
		setLogoBusy(true);
		try {
			if (await allyLogoApi.upload(editing.id, file)) {
				setEditing({ ...editing, hasLogo: true });
				setLogoVersion((v) => v + 1);
				await refresh();
			}
		} finally {
			setLogoBusy(false);
		}
	}

	async function handleLogoRemove() {
		if (!editing) return;
		setLogoBusy(true);
		try {
			if (await allyLogoApi.remove(editing.id)) {
				setEditing({ ...editing, hasLogo: false });
				await refresh();
			}
		} finally {
			setLogoBusy(false);
		}
	}

	async function doDelete() {
		if (!confirmDelete) return;
		setDeleting(true);
		const ok = await alliesAdminApi.remove(confirmDelete.id);
		setDeleting(false);
		if (ok) {
			await refresh();
			if (editing?.id === confirmDelete.id) resetForm();
		}
		setConfirmDelete(null);
	}

	let btnLabel;
	if (saving) btnLabel = "Guardando...";
	else if (editing) btnLabel = "Guardar";
	else btnLabel = "Crear";

	const remaining = ALLY_LIMITS.description.max - form.description.length;

	return (
		<div className="p-8 grid gap-6 md:grid-cols-2">
			<form onSubmit={handleSubmit} className="flex flex-col gap-3">
				<h1>{editing ? `Editar #${editing.id}: ${editing.name}` : "Nueva comunidad amiga"}</h1>

				<input
					placeholder="Título"
					value={form.name}
					onChange={(e) => setForm({ ...form, name: e.target.value })}
					required
					minLength={ALLY_LIMITS.name.min}
					maxLength={ALLY_LIMITS.name.max}
					className="p-2 rounded-xxl border border-alt bg-surface"
				/>

				<label className="flex flex-col gap-1">
					<textarea
						placeholder="Descripción"
						value={form.description}
						onChange={(e) => setForm({ ...form, description: e.target.value })}
						required
						minLength={ALLY_LIMITS.description.min}
						maxLength={ALLY_LIMITS.description.max}
						rows={4}
						className="p-2 rounded-xxl border border-alt bg-surface"
					/>
					<span className={`text-xs ${remaining < 40 ? "text-warn" : "opacity-60"}`}>{remaining} caracteres restantes</span>
				</label>

				<input
					placeholder="Invitación (https://discord.gg/…)"
					value={form.inviteUrl}
					onChange={(e) => setForm({ ...form, inviteUrl: e.target.value })}
					required
					maxLength={ALLY_LIMITS.inviteUrl.max}
					className="p-2 rounded-xxl border border-alt bg-surface"
				/>

				<input
					placeholder="Ticket de origen (opcional, ej. ADC-123)"
					value={form.sourceTicketKey}
					onChange={(e) => setForm({ ...form, sourceTicketKey: e.target.value })}
					maxLength={40}
					className="p-2 rounded-xxl border border-alt bg-surface"
				/>
				<span className="text-xs opacity-60 -mt-2">
					Deja registrado quién pidió el alta sin guardar sus datos acá: el contacto vive en el ticket.
				</span>

				<label className="flex items-center gap-2">
					<input type="checkbox" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} /> Visible en la
					home
				</label>

				{error && <p className="text-sm text-warn">{error}</p>}

				{editing && (
					<div className="flex flex-col gap-2 p-3 rounded-xxl border border-alt bg-surface">
						<span className="text-sm opacity-80">Logo</span>
						{editing.hasLogo && (
							<img
								src={`${allyLogoUrl(editing.id)}?v=${logoVersion}`}
								alt={`Logo de ${editing.name}`}
								className="w-20 h-20 object-cover rounded-xxl"
							/>
						)}
						<div className="flex items-center gap-2">
							<label className="cursor-pointer text-sm underline">
								{editing.hasLogo ? "Reemplazar logo" : "Subir logo"}
								<input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={logoBusy} />
							</label>
							{editing.hasLogo && (
								<button
									type="button"
									className="text-sm text-red-500 bg-transparent border-0 cursor-pointer"
									onClick={handleLogoRemove}
									disabled={logoBusy}
								>
									Quitar
								</button>
							)}
							{logoBusy && <span className="text-sm opacity-60">Procesando…</span>}
						</div>
					</div>
				)}

				<div className="flex gap-2">
					<adc-button type="submit" disabled={saving} aria-label={editing ? "Guardar comunidad" : "Crear comunidad"} label={btnLabel} />
					{editing && <adc-button type="button" variant="accent-outlined" aria-label="Cancelar edición" onClick={resetForm} label="Cancelar" />}
				</div>
			</form>

			<div>
				<h2>Comunidades listadas</h2>
				<p className="text-sm opacity-70 mt-1">
					El <strong>id</strong> es el que se usa en <code>/potenciar</code> desde el Discord.
				</p>
				<ul className="flex flex-col gap-2 mt-2">
					{allies.map((a) => (
						<li key={a.id} className="px-4 py-3 bg-surface rounded-xxl flex items-center justify-between gap-3 hover:bg-alt transition-colors">
							<button
								type="button"
								className="min-w-0 flex-1 text-left bg-transparent border-0 p-0 text-text cursor-pointer"
								onClick={() => startEdit(a)}
								aria-label={`Editar ${a.name}`}
							>
								<span className="font-mono text-xs opacity-60 mr-2">#{a.id}</span>
								<span className="truncate">{a.name}</span>
								<span className="text-xs opacity-60 ml-2">⚡ {a.boostCount}</span>
								{a.visible === false && <span className="text-xs text-warn ml-2">(oculta)</span>}
							</button>
							<span className="flex gap-1 items-center">
								<adc-button-rounded aria-label={`Editar ${a.name}`} onClick={() => startEdit(a)}>
									<adc-icon-edit />
								</adc-button-rounded>
								<adc-button-rounded variant="danger" aria-label={`Eliminar ${a.name}`} onClick={() => setConfirmDelete(a)}>
									<adc-icon-trash />
								</adc-button-rounded>
							</span>
						</li>
					))}
				</ul>
			</div>

			{confirmDelete && (
				<ConfirmModal
					message={`¿Eliminar "${confirmDelete.name}" del directorio? Para retirarla temporalmente alcanza con destildar "Visible".`}
					busy={deleting}
					onClose={() => setConfirmDelete(null)}
					onConfirm={doDelete}
				/>
			)}
		</div>
	);
}

export function AdminAlliesPage() {
	return <AdminGate requireGlobalAdmin>{() => <AlliesAdminBody />}</AdminGate>;
}
