"use client"
import Link from "next/link"
import { useState } from "react"

export default function Home() {
  const [hoverFeature, setHoverFeature] = useState<number | null>(null)
  const [hoverPrimary, setHoverPrimary] = useState(false)
  const [hoverSecondary, setHoverSecondary] = useState(false)
  const [hoverInfoCta, setHoverInfoCta] = useState(false)
  const [hoverFooterLinks, setHoverFooterLinks] = useState<{ [key: number]: boolean }>({})

  const features = [
    {
      icon: "📊",
      title: "Gestione File Excel",
      description: "Carica e gestisci facilmente i tuoi file Excel per l'elaborazione dei dati.",
    },
    {
      icon: "🔄",
      title: "Sostituzioni Automatiche",
      description: "Sistema intelligente per la sostituzione e normalizzazione dei valori.",
    },
    {
      icon: "📈",
      title: "Analisi Statistiche",
      description: "Visualizza statistiche dettagliate sulle operazioni eseguite.",
    },
    {
      icon: "💾",
      title: "Dizionario Personalizzato",
      description: "Crea e mantieni un dizionario personalizzato per le sostituzioni.",
    },
  ]

  const styles = {
    container: {
      minHeight: "100vh",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#f7fafc",
    },
    hero: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      padding: "80px 0 100px",
      position: "relative" as const,
    },
    heroContent: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 20px",
      position: "relative" as const,
      zIndex: 2,
    },
    heroTitle: {
      fontSize: "3.5rem",
      fontWeight: "800",
      marginBottom: "20px",
      lineHeight: "1.2",
      maxWidth: "800px",
    },
    heroSubtitle: {
      fontSize: "1.5rem",
      fontWeight: "400",
      marginBottom: "40px",
      maxWidth: "700px",
      lineHeight: "1.6",
      opacity: 0.9,
    },
    ctaButton: {
      display: "inline-flex",
      alignItems: "center",
      backgroundColor: "white",
      color: "#667eea",
      padding: "16px 32px",
      borderRadius: "50px",
      fontSize: "1.2rem",
      fontWeight: "600",
      textDecoration: "none",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
      borderWidth: "0",
      borderStyle: "none",
      borderColor: "transparent",
    },
    ctaButtonHover: {
      display: "inline-flex",
      alignItems: "center",
      backgroundColor: "white",
      color: "#667eea",
      padding: "16px 32px",
      borderRadius: "50px",
      fontSize: "1.2rem",
      fontWeight: "600",
      textDecoration: "none",
      transition: "all 0.3s ease",
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
      borderWidth: "0",
      borderStyle: "none",
      borderColor: "transparent",
      transform: "translateY(-3px)",
    },
    secondaryButton: {
      display: "inline-flex",
      alignItems: "center",
      backgroundColor: "transparent",
      color: "white",
      padding: "16px 32px",
      borderRadius: "50px",
      fontSize: "1.2rem",
      fontWeight: "600",
      textDecoration: "none",
      transition: "all 0.3s ease",
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: "rgba(255, 255, 255, 0.3)",
      marginLeft: "20px",
    },
    secondaryButtonHover: {
      display: "inline-flex",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      color: "white",
      padding: "16px 32px",
      borderRadius: "50px",
      fontSize: "1.2rem",
      fontWeight: "600",
      textDecoration: "none",
      transition: "all 0.3s ease",
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: "rgba(255, 255, 255, 0.3)",
      marginLeft: "20px",
      transform: "translateY(-3px)",
    },
    buttonIcon: {
      marginRight: "10px",
      fontSize: "1.4rem",
    },
    main: {
      maxWidth: "1200px",
      margin: "-60px auto 80px",
      padding: "0 20px",
      position: "relative" as const,
      zIndex: 3,
    },
    featuresGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "30px",
      marginBottom: "60px",
    },
    featureCard: {
      backgroundColor: "white",
      borderRadius: "20px",
      padding: "40px 30px",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
      transition: "all 0.3s ease",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#e2e8f0",
      height: "100%",
      display: "flex",
      flexDirection: "column" as const,
      cursor: "pointer",
    },
    featureCardHover: {
      backgroundColor: "white",
      borderRadius: "20px",
      padding: "40px 30px",
      boxShadow: "0 20px 30px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#667eea",
      height: "100%",
      display: "flex",
      flexDirection: "column" as const,
      cursor: "pointer",
      transform: "translateY(-10px)",
    },
    featureIcon: {
      fontSize: "3rem",
      marginBottom: "20px",
      display: "inline-block",
    },
    featureTitle: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#2d3748",
      marginBottom: "15px",
    },
    featureDescription: {
      fontSize: "1rem",
      color: "#718096",
      lineHeight: "1.6",
    },
    infoSection: {
      backgroundColor: "white",
      borderRadius: "20px",
      padding: "60px",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      textAlign: "center" as const,
      marginBottom: "80px",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#e2e8f0",
    },
    infoTitle: {
      fontSize: "2.5rem",
      fontWeight: "700",
      color: "#2d3748",
      marginBottom: "20px",
    },
    infoDescription: {
      fontSize: "1.2rem",
      color: "#718096",
      lineHeight: "1.6",
      maxWidth: "800px",
      marginBottom: "40px",
    },
    infoCta: {
      display: "inline-flex",
      alignItems: "center",
      backgroundColor: "#667eea",
      color: "white",
      padding: "16px 32px",
      borderRadius: "50px",
      fontSize: "1.2rem",
      fontWeight: "600",
      textDecoration: "none",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 15px rgba(102, 126, 234, 0.2)",
      borderWidth: "0",
      borderStyle: "none",
      borderColor: "transparent",
    },
    infoCtaHover: {
      display: "inline-flex",
      alignItems: "center",
      backgroundColor: "#667eea",
      color: "white",
      padding: "16px 32px",
      borderRadius: "50px",
      fontSize: "1.2rem",
      fontWeight: "600",
      textDecoration: "none",
      transition: "all 0.3s ease",
      boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
      borderWidth: "0",
      borderStyle: "none",
      borderColor: "transparent",
      transform: "translateY(-3px)",
    },
    footer: {
      backgroundColor: "#2d3748",
      color: "white",
      padding: "60px 0 40px",
    },
    footerContent: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 20px",
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
    },
    footerLogo: {
      fontSize: "1.8rem",
      fontWeight: "700",
      marginBottom: "30px",
    },
    footerLinks: {
      display: "flex",
      gap: "30px",
      marginBottom: "40px",
    },
    footerLink: {
      color: "white",
      textDecoration: "none",
      fontSize: "1rem",
      opacity: 0.8,
      transition: "all 0.3s ease",
    },
    footerLinkHover: {
      color: "white",
      textDecoration: "none",
      fontSize: "1rem",
      opacity: 1,
      transition: "all 0.3s ease",
    },
    footerCopyright: {
      fontSize: "0.9rem",
      opacity: 0.6,
    },
    decorativeCircle: {
      position: "absolute" as const,
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.1)",
    },
    circle1: {
      width: "300px",
      height: "300px",
      top: "-100px",
      right: "10%",
    },
    circle2: {
      width: "200px",
      height: "200px",
      bottom: "-50px",
      left: "5%",
    },
    circle3: {
      width: "150px",
      height: "150px",
      top: "20%",
      left: "15%",
    },
  }

  const footerLinks = [
    { text: "Assistenza", href: "#" },
    { text: "Documentazione", href: "#" },
    { text: "Privacy", href: "#" },
    { text: "Termini di Servizio", href: "#" },
  ]

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={{ ...styles.decorativeCircle, ...styles.circle1 }}></div>
        <div style={{ ...styles.decorativeCircle, ...styles.circle2 }}></div>
        <div style={{ ...styles.decorativeCircle, ...styles.circle3 }}></div>

        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Sistema di Gestione Sostituzioni Havas Media</h1>
          <p style={styles.heroSubtitle}>
            Ottimizza il tuo flusso di lavoro con la nostra piattaforma avanzata per la gestione e normalizzazione dei
            dati Excel.
          </p>
          <div>
            <Link
              href="/login"
              style={hoverPrimary ? styles.ctaButtonHover : styles.ctaButton}
              onMouseEnter={() => setHoverPrimary(true)}
              onMouseLeave={() => setHoverPrimary(false)}
            >
              <span style={styles.buttonIcon}>🚀</span>
              Accedi al Sistema
            </Link>
            <a
              href="#info"
              style={hoverSecondary ? styles.secondaryButtonHover : styles.secondaryButton}
              onMouseEnter={() => setHoverSecondary(true)}
              onMouseLeave={() => setHoverSecondary(false)}
            >
              <span style={styles.buttonIcon}>ℹ️</span>
              Scopri di più
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <main style={styles.main}>
        <div style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div
              key={index}
              style={hoverFeature === index ? styles.featureCardHover : styles.featureCard}
              onMouseEnter={() => setHoverFeature(index)}
              onMouseLeave={() => setHoverFeature(null)}
            >
              <span style={styles.featureIcon}>{feature.icon}</span>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div id="info" style={styles.infoSection}>
          <h2 style={styles.infoTitle}>Come funziona</h2>
          <p style={styles.infoDescription}>
            Il nostro sistema semplifica il processo di normalizzazione dei dati nei file Excel. Carica i tuoi file,
            seleziona le colonne da elaborare e il sistema suggerirà automaticamente le sostituzioni basate sul
            dizionario esistente. Puoi accettare i suggerimenti, inserire valori personalizzati o arricchire il
            dizionario con nuove corrispondenze.
          </p>
          <Link
            href="/login"
            style={hoverInfoCta ? styles.infoCtaHover : styles.infoCta}
            onMouseEnter={() => setHoverInfoCta(true)}
            onMouseLeave={() => setHoverInfoCta(false)}
          >
            Inizia ora
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerLogo}>Havas Media</div>
          <div style={styles.footerLinks}>
            {footerLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                style={hoverFooterLinks[index] ? styles.footerLinkHover : styles.footerLink}
                onMouseEnter={() => setHoverFooterLinks((prev) => ({ ...prev, [index]: true }))}
                onMouseLeave={() => setHoverFooterLinks((prev) => ({ ...prev, [index]: false }))}
              >
                {link.text}
              </a>
            ))}
          </div>
          <div style={styles.footerCopyright}>© {new Date().getFullYear()} Havas Media. Tutti i diritti riservati.</div>
        </div>
      </footer>
    </div>
  )
}
