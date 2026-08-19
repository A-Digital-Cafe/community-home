import { publicEnv } from "@common/utils/public-env.js";
import { AlliesSection } from "../components/allies/AlliesSection";

/** Vacío si el despliegue no configuró `ADC_PUBLIC_DISCORD_URL`: ahí no se ofrece el enlace. */
const DISCORD_URL = publicEnv("discordUrl");

/** Redes de la marca. Las que no estén configuradas no se muestran, en vez de quedar rotas. */
const SOCIAL_LINKS = [
	{ label: "Twitch", href: publicEnv("socialTwitch") },
	{ label: "YouTube", href: publicEnv("socialYoutube") },
	{ label: "Instagram", href: publicEnv("socialInstagram") },
	{ label: "GitHub", href: publicEnv("socialGithub") },
	{ label: "Donaciones", href: publicEnv("donationsUrl") },
].filter((link) => link.href);

const GITHUB_URL = publicEnv("socialGithub");

const BRAND = {
	name: "Abby's Digital Cafe",
	// Extendida a propósito (no es un slogan de una línea): la home necesita texto real para SEO,
	// y acá es donde se cuenta qué se puede hacer en la comunidad, sin caer en relleno de palabras clave.
	description:
		"Abby's Digital Cafe es una comunidad de programadores y estudiantes que aprenden tecnologías nuevas, " +
		"comparten código abierto y se ayudan entre sí. Sumate para proponer tus propios proyectos e ideas, " +
		"pedir una mano o colaborar con quienes ya están construyendo algo 🧡",
	slogan: "Una taza de código con tintes de amistad",
};

const SECTION = "mt-14 max-w-7xl mx-auto";

export function HomePage() {
	return (
		<div className="px-4 sm:px-6">
			<section
				id="home"
				className="flex flex-col items-center text-center max-w-3xl mx-auto"
				aria-label="Página principal de Abby's Digital Cafe"
			>
				<h1 className="text-3xl font-heading mb-3">{BRAND.name}</h1>
				<p className="mb-6 contain-content">{BRAND.description}</p>
				{DISCORD_URL && <adc-button href={DISCORD_URL} label="Entrar al Discord" />}
				<adc-quote class="pr-16 mt-6">{BRAND.slogan}</adc-quote>
			</section>

			{/* Las tarjetas llevan a algún lado: antes anunciaban que existía contenido propio sin dar
			    forma de llegar a él (Paths y Artículos sólo estaban en el header). */}
			<section className={SECTION} aria-label="Qué vas a encontrar">
				<h2 className="text-2xl font-heading text-center mb-6">Qué vas a encontrar</h2>
				<div className="grid gap-4 sm:grid-cols-3">
					<a href="/paths" className="no-underline">
						<adc-feature-card title="Rutas de aprendizaje">
							<span slot="icon">
								<adc-icon-learning size="2rem"></adc-icon-learning>
							</span>
							<span>Contenido ordenado para crecer paso a paso.</span>
						</adc-feature-card>
					</a>
					<a href="/articles" className="no-underline">
						<adc-feature-card title="Artículos">
							<span slot="icon">
								<adc-icon-file size="2rem"></adc-icon-file>
							</span>
							<span>Guías y apuntes escritos por la comunidad.</span>
						</adc-feature-card>
					</a>
					{GITHUB_URL ? (
						<a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="no-underline">
							<adc-feature-card title="Open Source">
								<span slot="icon">
									<adc-icon-opensource size="2rem"></adc-icon-opensource>
								</span>
								<span>Proyectos libres para colaborar y aprender.</span>
							</adc-feature-card>
						</a>
					) : (
						<adc-feature-card title="Open Source">
							<span slot="icon">
								<adc-icon-opensource size="2rem"></adc-icon-opensource>
							</span>
							<span>Proyectos libres para colaborar y aprender.</span>
						</adc-feature-card>
					)}
				</div>
			</section>

			<AlliesSection />

			<section className={`flex flex-col items-center ${SECTION}`} aria-label="Testimonios de la comunidad">
				<h2 className="text-2xl font-heading text-center mb-8 w-max">Testimonios de la comunidad</h2>
				<div className="grid gap-4 sm:grid-cols-3">
					<adc-testimonial-card author="@lokitomiko">
						Buena comunidad activa para la gente que hay. Se disfruta, únanse. (desde Discord)
					</adc-testimonial-card>
					<adc-testimonial-card author="@soysalwa">
						Eehh. No sé. :xd: Mentira, "Cuando no sepas que hacer o donde ir, recuerda que un café caliente soluciona muchos dolores
						de cabeza, únete al café digital de Abby."
					</adc-testimonial-card>
					<adc-testimonial-card author="Dev C">Gran comunidad para programar y relajarse.</adc-testimonial-card>
				</div>
			</section>

			<section className={`${SECTION} text-center space-y-4`} aria-label="Redes sociales">
				<h2 className="text-2xl font-heading">Nuestras redes</h2>
				<div className="flex justify-center gap-3 flex-wrap">
					{SOCIAL_LINKS.map(({ label, href }) => (
						<adc-button key={label} variant="accent-outlined" href={href} label={label} />
					))}
				</div>
			</section>
		</div>
	);
}
