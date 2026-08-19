import "@ui-library/utils/react-jsx";
import { useCallback } from "react";
import { publicEnv } from "@common/utils/public-env.js";

const STATUS_TICKETS_URL = "https://status.adigitalcafe.com/status/tickets";
const DISCORD_URL = publicEnv("discordUrl");

interface Props {
	readonly onClose: () => void;
}

/**
 * Requisitos y aviso legal del directorio de comunidades.
 *
 * Todo el encuadre legal vive acá y no en un documento de `help`: no requiere aceptación, así que
 * no dispara el preaviso de 30 días de los documentos versionados. Lo que no puede faltar sin que
 * el listado se lea como un aval: que no somos parte de esas comunidades, que no hay pago de por
 * medio, que el orden no certifica calidad, cómo se pide la baja y que el retiro es discrecional.
 */
export function AlliesInfoModal({ onClose }: Props) {
	const ref = useCallback(
		(el: HTMLElement | null) => {
			if (el) el.addEventListener("adcClose", onClose);
		},
		[onClose]
	);

	return (
		<adc-modal ref={ref} open modalTitle="Aparecer en el directorio de comunidades" size="lg">
			<div className="space-y-5 text-text text-sm leading-relaxed">
				<section>
					<h3 className="font-heading text-base mb-1">Qué es esta lista</h3>
					<p>
						Un directorio de comunidades que nos propusieron aparecer y que nos parecieron decentes. <strong>No son parte de ADC</strong>:
						no las operamos, no las moderamos y no respondemos por lo que pase dentro de ellas. Figurar acá{" "}
						<strong>no implica respaldo</strong> ni verificación de nada. <strong>No hay pago ni contraprestación económica</strong> en
						ningún sentido: no cobramos por listar ni pagamos por aparecer en otros lados.
					</p>
				</section>

				<section>
					<h3 className="font-heading text-base mb-1">Requisitos para listarse</h3>
					<ul className="list-disc pl-5 space-y-1">
						<li>
							Sin discurso de odio ni discriminación, en línea con nuestros{" "}
							<adc-platform-link href="https://help.adigitalcafe.com/values">valores</adc-platform-link>.
						</li>
						<li>Sin contenido para adultos accesible sin control: acá entra gente desde los 13 años.</li>
						<li>Moderación activa y humana, y cumplir las condiciones de Discord y la ley del país donde operan.</li>
						<li>
							<strong>Al menos 300 miembros.</strong>
						</li>
						<li>
							<strong>Un anuncio con @everyone</strong> en su servidor dentro de las <strong>24 horas</strong> de publicados acá.
						</li>
					</ul>
				</section>

				<section>
					<h3 className="font-heading text-base mb-1">Cómo se ordena</h3>
					<p>
						Por <strong>potencia</strong>: los boosts que la comunidad reparte con <code>/potenciar</code> en nuestro Discord. Es un orden
						de interés, <strong>no un ranking de calidad</strong> ni una certificación, y no lo decide ningún criterio pago.
					</p>
				</section>

				<section>
					<h3 className="font-heading text-base mb-1">Cómo pedir la baja</h3>
					<p>
						Abriendo un ticket de tipo <strong>“Datos”</strong> en{" "}
						<adc-external-link href={STATUS_TICKETS_URL}>status.adigitalcafe.com</adc-external-link>, que{" "}
						<strong>no requiere tener cuenta</strong>. La quitamos <strong>dentro de los 5 días hábiles</strong>, sin pedir
						explicaciones.
					</p>
				</section>

				<section>
					<h3 className="font-heading text-base mb-1">Lo que nos reservamos</h3>
					<p>
						Podemos retirar cualquier comunidad <strong>en cualquier momento, sin preaviso ni expresión de causa</strong>. Aparecer acá no
						crea sociedad, mandato, franquicia ni relación laboral entre ADC y esa comunidad, ni da derecho a permanecer en la lista, a
						recibir tráfico ni a ocupar una posición determinada.
					</p>
				</section>

				<section>
					<h3 className="font-heading text-base mb-1">Cómo proponerla</h3>
					<p>
						Escribinos por{" "}
						{DISCORD_URL ? (
							<adc-external-link href={DISCORD_URL}>nuestro Discord</adc-external-link>
						) : (
							<span>nuestros canales de contacto</span>
						)}{" "}
						contando qué comunidad es y por qué encaja. La decisión es nuestra y no es apelable.
					</p>
				</section>
			</div>
			<div slot="footer" className="flex justify-end">
				<adc-button variant="accent-outlined" size="small" label="Cerrar" onClick={onClose} />
			</div>
		</adc-modal>
	);
}
