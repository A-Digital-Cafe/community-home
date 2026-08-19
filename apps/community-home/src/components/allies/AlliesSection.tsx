import "@ui-library/utils/react-jsx";
import { useCallback, useEffect, useState } from "react";
import { alliesApi, ALLY_PAGE_SIZE, type AllySort, type CommunityAlly } from "../../utils/allies-api";
import { AllyCard } from "./AllyCard";
import { AlliesInfoModal } from "./AlliesInfoModal";

const SORT_TABS = [
	{ id: "power", label: "Potencia total" },
	{ id: "recent", label: "Potenciadas hace poco" },
];

export function AlliesSection() {
	const [allies, setAllies] = useState<CommunityAlly[]>([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [sort, setSort] = useState<AllySort>("power");
	const [loading, setLoading] = useState(true);
	const [infoOpen, setInfoOpen] = useState(false);

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		alliesApi.list({ sort, limit: ALLY_PAGE_SIZE, start: (page - 1) * ALLY_PAGE_SIZE }).then((r) => {
			if (cancelled) return;
			setAllies(r.allies);
			setTotal(r.total);
			setLoading(false);
		});
		return () => {
			cancelled = true;
		};
	}, [sort, page]);

	const tabsRef = useCallback((el: HTMLElement | null) => {
		if (!el) return;
		el.addEventListener("adcTabChange", (e: Event) => {
			setSort((e as CustomEvent<string>).detail === "recent" ? "recent" : "power");
			setPage(1);
		});
	}, []);

	const paginationRef = useCallback((el: HTMLElement | null) => {
		if (!el) return;
		el.addEventListener("adcPageChange", (e: Event) => setPage((e as CustomEvent<number>).detail));
	}, []);

	// Sin comunidades cargadas la sección entera sobra: no se pinta un bloque vacío en la home.
	if (!loading && total === 0) return null;

	const totalPages = Math.max(1, Math.ceil(total / ALLY_PAGE_SIZE));

	// `max-w-7xl`: mismo ancho que el resto de las secciones de la home (ver comentario de `SECTION`
	// en HomePage.tsx) — es el piso `xl:min-w-7xl` de `main` en adc-layout, así que la grilla lo llena
	// en vez de quedar más angosta que su propio contenedor.
	return (
		<section id="aliados" className="mt-12 max-w-7xl mx-auto" aria-label="Comunidades amigas">
			<h2 className="text-2xl font-heading text-center">Comunidades amigas</h2>
			<p className="text-sm text-muted text-center max-w-3xl mx-auto mt-2">
				Comunidades ajenas a ADC: no las operamos ni las moderamos, y aparecer acá no implica respaldo ni relación comercial.{" "}
				<button type="button" className="underline text-primary cursor-pointer" onClick={() => setInfoOpen(true)}>
					Requisitos y aviso legal
				</button>
			</p>

			<div className="flex justify-center mt-4">
				<adc-tabs ref={tabsRef} tabs={JSON.stringify(SORT_TABS)} activeTab={sort} variant="pills" />
			</div>

			{loading ? (
				<div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
					{["a1", "a2", "a3"].map((k) => (
						<adc-skeleton key={k} variant="rectangular" height="180px" />
					))}
				</div>
			) : (
				<div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
					{allies.map((ally) => (
						<AllyCard key={ally.id} ally={ally} />
					))}
				</div>
			)}

			{totalPages > 1 && (
				<div className="flex justify-center mt-6">
					<adc-pagination ref={paginationRef} currentPage={page} totalPages={totalPages} />
				</div>
			)}

			<div className="flex justify-center mt-6">
				<adc-button variant="accent-outlined" label="Quiero aparecer aquí" onClick={() => setInfoOpen(true)} />
			</div>

			{infoOpen && <AlliesInfoModal onClose={() => setInfoOpen(false)} />}
		</section>
	);
}
