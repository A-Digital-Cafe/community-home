import "@ui-library/utils/react-jsx";
import { useEffect, useRef, useState } from "react";
import { allyLogoUrl, type CommunityAlly } from "../../utils/allies-api";

interface Props {
	readonly ally: CommunityAlly;
}

export function AllyCard({ ally }: Props) {
	const [expanded, setExpanded] = useState(false);
	const [clampable, setClampable] = useState(false);
	const textRef = useRef<HTMLSpanElement>(null);

	// Se mide el recorte real en vez de contar caracteres: con un umbral fijo, una descripción
	// apenas más larga que tres líneas queda cortada y sin "Ver más" con el que abrirla.
	useEffect(() => {
		const el = textRef.current;
		if (el && !expanded) setClampable(el.scrollHeight > el.clientHeight + 2);
	}, [expanded, ally.description]);

	// Sin `block` junto a `line-clamp-3`: las dos utilidades fijan `display` y la de bloque gana por
	// orden en la hoja, con lo que el recorte no se aplicaría nunca.
	// Click en el propio texto, no en un contenedor: si el handler viviera en el <div> de afuera, el
	// click en "Ver más" burbujearía hasta él y el toggle se aplicaría dos veces.
	const text = (
		<span
			ref={textRef}
			className={`${expanded ? "block" : "line-clamp-3"}${clampable ? " cursor-pointer" : ""}`}
			onClick={clampable ? () => setExpanded((v) => !v) : undefined}
		>
			{ally.description}
		</span>
	);

	return (
		<adc-card class="p-4 flex flex-col gap-3 h-full">
			<div className="flex items-center gap-3">
				{/* Sin logo no se pinta un hueco: el título ocupa la fila entera. */}
				{ally.hasLogo && (
					<img
						src={allyLogoUrl(ally.id)}
						alt=""
						loading="lazy"
						width={48}
						height={48}
						className="w-12 h-12 rounded-xxl object-cover shrink-0"
					/>
				)}
				<div className="min-w-0 flex-1">
					<h3 className="font-heading text-lg truncate">{ally.name}</h3>
					<span className="text-xs text-muted" title={`${ally.boostCount} de potencia acumulada`}>
						⚡ {ally.boostCount}
					</span>
				</div>
			</div>

			{/* El texto no va dentro del <button>: el CSS sin capa de la UI library le impone a los
			    botones su propio tamaño de fuente y la descripción saldría más chica que el resto.
			    El botón es el que da acceso por teclado y a lectores de pantalla. */}
			<div>
				{text}
				{clampable && (
					<button
						type="button"
						onClick={() => setExpanded((v) => !v)}
						aria-expanded={expanded}
						className="text-xs text-primary underline mt-1 cursor-pointer"
					>
						{expanded ? "Ver menos" : "Ver más"}
					</button>
				)}
			</div>

			<div className="mt-auto pt-1">
				{/* `nofollow ugc`: el destino lo propuso un tercero, no es un enlace editorial nuestro. */}
				<adc-button
					href={ally.inviteUrl}
					rel="noopener noreferrer nofollow ugc"
					size="small"
					label="Entrar al Discord"
					ariaLabel={`Entrar al Discord de ${ally.name}`}
				/>
			</div>
		</adc-card>
	);
}
