import "@ui-library/utils/react-jsx";
import { useEffect, useState } from "react";
import { getSession } from "@ui-library/utils/session";
import { canEditContent, canPublish } from "../utils/permissions";

/**
 * Contenido dinámico para el header del layout.
 * Muestra enlaces de administración sólo cuando el usuario tiene permisos.
 */
export default function HeaderNav() {
	const [showAdmin, setShowAdmin] = useState(false);
	const [showPublish, setShowPublish] = useState(false);
	const [showAllies, setShowAllies] = useState(false);

	useEffect(() => {
		getSession().then((s) => {
			const perms = s.user?.perms;
			setShowAdmin(canEditContent(perms));
			setShowPublish(canPublish(perms));
			// El directorio de comunidades es decisión editorial de plataforma: sólo admin global.
			setShowAllies(s.user?.isAdmin === true);
		});
	}, []);

	return (
		<ul className="flex flex-wrap items-center gap-x-10">
			<li>
				<a href="/articles" className="hover:underline">
					Artículos
				</a>
			</li>
			<li>
				<a href="/paths" className="hover:underline">
					Paths
				</a>
			</li>
			{showAdmin && (
				<>
					<li>
						<a href="/admin/articles" className="hover:underline">
							Mis artículos
						</a>
					</li>
					<li>
						<a href="/admin/publish" className="hover:underline">
							Publicar
						</a>
					</li>
				</>
			)}
			{showPublish && (
				<li>
					<a href="/admin/paths" className="hover:underline">
						Paths admin
					</a>
				</li>
			)}
			{showAllies && (
				<li>
					<a href="/admin/allies" className="hover:underline">
						Comunidades
					</a>
				</li>
			)}
		</ul>
	);
}
