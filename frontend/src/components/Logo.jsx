// Logo de TrustTix. El PNG es negro con fondo transparente; se invierte a
// blanco para el tema oscuro.
export default function Logo({ size = 40, className = '' }) {
  return (
    <img
      src="/logo-trusttix.png"
      alt="TrustTix"
      width={size}
      height={size}
      className={`logo ${className}`}
    />
  )
}
