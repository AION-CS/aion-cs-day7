import { getLang } from "@/lib/lang";

/**
 * Plain-language glossary (CLAUDE.md #19), in English and German (#32). Every technical term, abbreviation or German word that the
 * material or a task uses is an entry here. In the text it becomes a dotted link; a click opens the explanation. Written for someone
 * who is NOT an expert: short sentences, everyday words, one example where it helps.
 *
 * `match` lists every English written form; `de.match` every form the German text uses (the English term itself, with the German
 * plural or genitive forms, and German words). The German `title` keeps the English term where German practitioners use it. An
 * all-capitals match ("CRM") is matched exactly, so ordinary words never turn into links.
 */
export type GlossDe = { title?: string; match: string[]; plain: string; example?: string };
export type GlossEntry = {
  id: string;
  title: string;
  match: string[];
  exactCase?: boolean;
  plain: string;
  example?: string;
  from?: string;
  de?: GlossDe;
};

export const GLOSSARY: GlossEntry[] = [
  // --- data, information, insight ---------------------------------------------------
  {
    id: "data-driven",
    title: "Data-driven",
    match: ["data-driven", "data-based"],
    plain: "Deciding from what the records show about customers, not only from memory or feeling. Experience still matters, for the cases the data cannot explain.",
    from: "Davenport & Harris 2007",
    de: {
      title: "Datengetrieben",
      match: ["datengetrieben", "datengetriebene", "datengetriebenen", "datengetriebener", "datenbasiert", "datenbasierte", "datenbasierten"],
      plain: "Aus dem entscheiden, was die Daten über Kunden zeigen, nicht nur aus Gedächtnis oder Gefühl. Erfahrung zählt weiter, für die Fälle, die die Daten nicht erklären.",
    },
  },
  {
    id: "gut-feeling",
    title: "Gut feeling",
    match: ["gut feeling", "experience-based"],
    plain: "A judgement made from memory and experience. It is fast and often good with customers you know well, but it misses the quiet ones and the ones you rarely think of.",
    from: "Kahneman 2011",
    de: {
      title: "Bauchgefühl",
      match: ["Bauchgefühl", "erfahrungsbasiert", "erfahrungsbasierte"],
      plain: "Ein Urteil aus Gedächtnis und Erfahrung. Es ist schnell und bei gut bekannten Kunden oft gut, übersieht aber die stillen und die, an die man selten denkt.",
    },
  },
  {
    id: "data",
    title: "Data (the first step)",
    match: ["Data"],
    exactCase: true,
    plain: "A single recorded fact: one login, one order, one ticket. On its own it says nothing yet; 11 logins could be a lot or a little.",
    from: "Ackoff 1989",
    de: { title: "Daten (erste Stufe)", match: ["Daten"], plain: "Ein einzelner erfasster Fakt: ein Login, eine Bestellung, ein Ticket. Für sich sagt er noch nichts; 11 Logins können viel oder wenig sein." },
  },
  {
    id: "information",
    title: "Information (the second step)",
    match: ["Information"],
    exactCase: true,
    plain: "Data summarised or compared: a total, an average, a share, a trend. It says what happened, not why and not what to do.",
    example: "“Logins fell 12% from the first to the second quarter.”",
    from: "Rowley 2007",
    de: { title: "Information (zweite Stufe)", match: ["Information"], plain: "Zusammengefasste oder verglichene Daten: eine Summe, ein Durchschnitt, ein Anteil, ein Trend. Sie sagt, was passiert ist, nicht warum und nicht, was zu tun ist.", example: "„Die Logins sanken vom ersten zum zweiten Quartal um 12 %.“" },
  },
  {
    id: "insight",
    title: "Insight",
    match: ["insight", "insights", "Insight", "Insights"],
    plain: "An explanation that says what information means and what to do about it: the “so what”. It is the step where data starts to be worth something.",
    example: "“Customers with one service leave four times as often, so the second service is where retention is won.”",
    de: { title: "Insight (Erkenntnis)", match: ["Insight", "Insights", "Erkenntnis", "Erkenntnisse"], plain: "Eine Erklärung, die sagt, was eine Information bedeutet und was zu tun ist: das „Na und“. Auf dieser Stufe beginnen Daten, etwas wert zu sein.", example: "„Kunden mit einem Service gehen viermal so oft, also wird Bindung beim zweiten Service gewonnen.“" },
  },
  {
    id: "big-data",
    title: "Big data",
    match: ["big data", "Big data", "Big Data"],
    plain: "Very large amounts of data that arrive fast and in many forms (logs, texts, clicks). It helps only when it is linked to a decision and good enough to trust; otherwise it adds noise.",
    from: "McAfee & Brynjolfsson 2012",
    de: { title: "Big Data", match: ["Big Data", "Big-Data"], plain: "Sehr große Datenmengen, die schnell und in vielen Formen ankommen (Logs, Texte, Klicks). Sie helfen nur, wenn sie mit einer Entscheidung verbunden und gut genug sind, um ihnen zu trauen; sonst erzeugen sie Rauschen." },
  },
  {
    id: "smart-insights",
    title: "Smart insights",
    match: ["smart insights", "smart insight", "Smart insights", "Smart Insights"],
    plain: "Insights from small, relevant data read well, instead of from as much data as possible. Usage, orders and tickets often say more about churn than any bought data set.",
    de: { title: "Smart Insights", match: ["Smart Insights", "Smart Insight"], plain: "Erkenntnisse aus kleinen, relevanten, gut gelesenen Daten statt aus möglichst vielen Daten. Nutzung, Bestellungen und Tickets sagen über Churn oft mehr als jeder gekaufte Datensatz." },
  },
  {
    id: "noise",
    title: "Noise",
    match: ["noise"],
    plain: "Data that changes no decision. It costs time to collect and read, and it can hide the few signals that matter.",
    de: { title: "Rauschen", match: ["Rauschen"], plain: "Daten, die keine Entscheidung ändern. Sie kosten Zeit beim Sammeln und Lesen und können die wenigen wichtigen Signale verdecken." },
  },
  {
    id: "predictive",
    title: "Predictive analytics, forecast",
    match: ["predictive analytics", "forecast", "forecasts", "forecasting"],
    plain: "Using what happened in the past to estimate what will happen next, for example which customers are likely to leave. A forecast is an estimate, not a fact.",
    from: "Provost & Fawcett 2013",
    de: { title: "Predictive Analytics, Prognose", match: ["Predictive Analytics", "Prognose", "Prognosen", "vorhersagen", "Vorhersage"], plain: "Aus dem, was früher passiert ist, schätzen, was als Nächstes passiert, zum Beispiel welche Kunden wahrscheinlich gehen. Eine Prognose ist eine Schätzung, keine Tatsache." },
  },
  {
    id: "lift",
    title: "Lift",
    match: ["lift", "Lift"],
    plain: "How many times more often something happens in one group than in everyone else. A lift of 5 means “five times as often”.",
    example: "20% of customers with falling usage left, 4% of the others: 20 ÷ 4 = a lift of 5.",
    from: "Neslin et al. 2006",
    de: { title: "Lift", match: ["Lift"], plain: "Wie viel Mal häufiger etwas in einer Gruppe passiert als bei allen anderen. Ein Lift von 5 heißt „fünfmal so oft“.", example: "20 % der Kunden mit sinkender Nutzung gingen, 4 % der anderen: 20 ÷ 4 = ein Lift von 5." },
  },
  {
    id: "revenue-at-risk",
    title: "Revenue at risk",
    match: ["revenue at risk"],
    plain: "The yearly revenue you would expect to lose if customers showing a signal leave at the usual rate: customers × churn rate × average revenue.",
    example: "30 customers × 20% × €12,000 = €72,000.",
    de: { title: "Gefährdeter Umsatz", match: ["gefährdeter Umsatz", "gefährdeten Umsatz", "gefährdete Umsatz"], plain: "Der Jahresumsatz, den man erwarten würde zu verlieren, wenn Kunden mit einem Signal mit der üblichen Rate gehen: Kunden × Churn Rate × durchschnittlicher Umsatz.", example: "30 Kunden × 20 % × 12.000 € = 72.000 €." },
  },
  {
    id: "rfm",
    title: "Frequency, time between purchases, service use",
    match: ["frequency of purchases", "time between purchases", "use of services", "order frequency"],
    plain: "Three kinds of behaviour data: how often a customer buys, how long since the last purchase (compared with their own rhythm), and how broadly they use what you offer. Together they say most about a customer's future.",
    from: "Fader et al. 2005",
    de: { title: "Häufigkeit, Zeit zwischen Käufen, Service-Nutzung", match: ["Häufigkeit der Käufe", "Zeit zwischen den Käufen", "Nutzung der Services", "Bestellhäufigkeit", "Kaufhäufigkeit"], plain: "Drei Arten von Verhaltensdaten: wie oft ein Kunde kauft, wie lange der letzte Kauf her ist (gemessen an seinem eigenen Rhythmus) und wie breit er nutzt, was Sie anbieten. Zusammen sagen sie das meiste über die Zukunft eines Kunden." },
  },
  // --- patterns -------------------------------------------------------------------
  {
    id: "pattern",
    title: "Behaviour pattern",
    match: ["behaviour pattern", "behaviour patterns", "behavioural pattern", "behavioural patterns", "pattern", "patterns"],
    plain: "A shape that repeats in how customers use a service over months: steady, falling, low from the start, or in waves. It tells you where to look, not yet why.",
    de: { title: "Verhaltensmuster", match: ["Verhaltensmuster", "Muster"], plain: "Eine Form, die sich darin wiederholt, wie Kunden einen Service über Monate nutzen: gleichmäßig, fallend, von Anfang an niedrig oder in Wellen. Sie sagt, wo man hinschauen soll, noch nicht warum." },
  },
  {
    id: "p-anchored",
    title: "Anchored (pattern)",
    match: ["Anchored"],
    exactCase: true,
    plain: "High, steady use of several services for a long time. These customers depend on you and are open to more.",
    de: { title: "Verankert (Muster)", match: ["Verankert", "verankert", "verankerte", "verankerten"], plain: "Hohe, gleichmäßige Nutzung mehrerer Services über lange Zeit. Diese Kunden sind auf Sie angewiesen und offen für mehr." },
  },
  {
    id: "p-fading",
    title: "Fading (pattern)",
    match: ["Fading"],
    exactCase: true,
    plain: "Use was good and is now falling: fewer logins, fewer services, longer gaps. Something changed on the customer's side; early outreach can still win them back.",
    de: { title: "Nachlassend (Muster)", match: ["Nachlassend", "nachlassend", "nachlassende", "nachlassenden"], plain: "Die Nutzung war gut und sinkt jetzt: weniger Logins, weniger Services, längere Abstände. Beim Kunden hat sich etwas geändert; frühe Ansprache kann ihn noch zurückgewinnen." },
  },
  {
    id: "p-dormant",
    title: "Dormant (pattern)",
    match: ["Dormant"],
    exactCase: true,
    plain: "Low use from the first day: one service, few users. The customer never got the value of what it bought; a guided second onboarding is the answer.",
    de: { title: "Ruhend (Muster)", match: ["Ruhend", "ruhend", "ruhende", "ruhenden"], plain: "Geringe Nutzung vom ersten Tag an: ein Service, wenige Nutzer. Der Kunde hat nie den Wert dessen bekommen, was er kaufte; ein begleitetes zweites Onboarding ist die Antwort." },
  },
  {
    id: "p-cyclical",
    title: "Cyclical (pattern)",
    match: ["Cyclical"],
    exactCase: true,
    plain: "Use comes in bursts tied to projects or seasons, with quiet phases between. A quiet phase is normal for these customers and not a churn signal.",
    de: { title: "Zyklisch (Muster)", match: ["Zyklisch", "zyklisch", "zyklische", "zyklischen"], plain: "Die Nutzung kommt in Schüben, an Projekte oder Saisons gebunden, mit ruhigen Phasen dazwischen. Eine ruhige Phase ist bei diesen Kunden normal und kein Abwanderungssignal." },
  },
  {
    id: "correlation",
    title: "Correlation and causation",
    match: ["correlation", "causation", "cause", "third factor"],
    plain: "Correlation means two things happen together. Causation means one makes the other happen. Data shows correlation; a third factor can cause both things you see.",
    example: "Many tickets and leaving go together, but both came from a failed migration.",
    from: "Pearl & Mackenzie 2018",
    de: { title: "Korrelation und Kausalität", match: ["Korrelation", "Kausalität", "Ursache", "dritter Faktor", "dritten Faktor"], plain: "Korrelation heißt, zwei Dinge treten zusammen auf. Kausalität heißt, eines bewirkt das andere. Daten zeigen Korrelation; ein dritter Faktor kann beides verursachen, was man sieht.", example: "Viele Tickets und Abwanderung gehen zusammen, aber beides kam aus einer gescheiterten Migration." },
  },
  {
    id: "sample",
    title: "Sample, small sample",
    match: ["sample", "small sample", "cases"],
    plain: "The customers a figure is based on. With few cases, one different outcome moves the result a lot, so a strong-looking difference may be chance.",
    de: { title: "Stichprobe", match: ["Stichprobe", "Stichproben", "Fälle", "Fällen"], plain: "Die Kunden, auf denen eine Zahl beruht. Bei wenigen Fällen verschiebt ein anderes Ergebnis das Ergebnis stark, also kann ein stark aussehender Unterschied Zufall sein." },
  },
  // --- measures and scores ----------------------------------------------------------
  {
    id: "efe",
    title: "Explanatory power, feasibility, effect",
    match: ["Explanatory power", "explanatory power", "Feasibility", "feasibility", "Effect"],
    exactCase: true,
    plain: "The three tests a data-based measure is scored on, each Low (1) to High (3), multiplied. Explanatory power: how strong the evidence behind it is. Feasibility: can it be done now. Effect: how much it changes.",
    example: "3 × 2 × 3 = 18.",
    de: { title: "Erklärungskraft, Machbarkeit, Wirkung", match: ["Erklärungskraft", "Machbarkeit", "Wirkung"], plain: "Die drei Tests, nach denen eine datenbasierte Maßnahme bewertet wird, jeweils Niedrig (1) bis Hoch (3), multipliziert. Erklärungskraft: wie stark die Evidenz dahinter ist. Machbarkeit: lässt es sich jetzt umsetzen. Wirkung: wie viel es ändert.", example: "3 × 2 × 3 = 18." },
  },
  {
    id: "health-score",
    title: "Health score",
    match: ["health score", "health scores", "Health score"],
    plain: "One number per customer, built from several data sources (usage, orders, services, tickets), that shows how at-risk the customer is, ideally with the reason beside it.",
    de: { title: "Health Score", match: ["Health Score", "Health Scores"], plain: "Eine Zahl pro Kunde, gebaut aus mehreren Datenquellen (Nutzung, Bestellungen, Services, Tickets), die zeigt, wie gefährdet der Kunde ist, am besten mit dem Grund daneben." },
  },
  {
    id: "early-warning",
    title: "Early warning",
    match: ["early warning", "early-warning", "early warnings"],
    plain: "A rule that flags customers before they decide to leave, for example when usage falls by 30% in a quarter, so someone can act in time.",
    de: { title: "Frühwarnung", match: ["Frühwarnung", "Frühwarnungen", "Frühwarnliste", "Frühwarnregeln", "Frühwarnregel"], plain: "Eine Regel, die Kunden markiert, bevor sie sich entscheiden zu gehen, etwa wenn die Nutzung in einem Quartal um 30 % sinkt, damit jemand rechtzeitig handeln kann." },
  },
  {
    id: "cohort",
    title: "Cohort, dashboard",
    match: ["cohort", "cohorts", "dashboard", "dashboards"],
    plain: "A cohort is a group of customers who started in the same period. A dashboard shows figures like churn per cohort or per pattern on one screen, updated regularly.",
    de: { title: "Kohorte, Dashboard", match: ["Kohorte", "Kohorten", "Dashboard", "Dashboards"], plain: "Eine Kohorte ist eine Gruppe von Kunden, die im selben Zeitraum begonnen haben. Ein Dashboard zeigt Kennzahlen wie Churn pro Kohorte oder pro Muster auf einem Bildschirm, regelmäßig aktualisiert." },
  },
  {
    id: "black-box",
    title: "Black box",
    match: ["black box", "black-box"],
    plain: "A system whose results you see but whose reasons you cannot. A black-box score may be right, but nobody can check it or explain it to the person who has to act.",
    de: { title: "Black Box", match: ["Black Box", "Black-Box"], plain: "Ein System, dessen Ergebnisse man sieht, dessen Gründe aber nicht. Ein Black-Box-Score kann stimmen, aber niemand kann ihn prüfen oder der Person erklären, die handeln soll." },
  },
  {
    id: "ai",
    title: "AI (artificial intelligence)",
    match: ["AI"],
    plain: "Software that learns patterns from data and makes predictions. Useful when its forecasts can be checked; risky when nobody can say why it predicts what it does.",
    de: { title: "KI (künstliche Intelligenz)", match: ["KI"], plain: "Software, die Muster aus Daten lernt und Vorhersagen macht. Nützlich, wenn man ihre Prognosen prüfen kann; riskant, wenn niemand sagen kann, warum sie vorhersagt, was sie vorhersagt." },
  },
  {
    id: "gdpr",
    title: "GDPR",
    match: ["GDPR"],
    plain: "The EU's data protection law. It says personal data may be collected only for a stated purpose and not more than needed, and it limits decisions about people made only by a machine.",
    from: "GDPR 2016",
    de: { title: "DSGVO (Datenschutz-Grundverordnung)", match: ["DSGVO"], plain: "Das Datenschutzgesetz der EU. Es sagt, dass personenbezogene Daten nur für einen genannten Zweck und nicht mehr als nötig erhoben werden dürfen, und es begrenzt Entscheidungen über Menschen, die nur eine Maschine trifft." },
  },
  {
    id: "data-quality",
    title: "Data quality, completeness",
    match: ["data quality", "complete", "completeness"],
    plain: "How far data can be trusted. Completeness is the share of records where a field is actually filled in; a field empty for half the customers describes only the other half.",
    from: "DAMA 2017",
    de: { title: "Datenqualität, Vollständigkeit", match: ["Datenqualität", "vollständig", "Vollständigkeit"], plain: "Wie weit man Daten trauen kann. Vollständigkeit ist der Anteil der Datensätze, in denen ein Feld wirklich ausgefüllt ist; ein Feld, das für die Hälfte der Kunden leer ist, beschreibt nur die andere Hälfte." },
  },
  {
    id: "data-source",
    title: "Data source",
    match: ["data source", "data sources"],
    plain: "A place data comes from: platform logs, the order system, the helpdesk, billing, the CRM, a survey. Each one is relevant only if a decision would change with it.",
    de: { title: "Datenquelle", match: ["Datenquelle", "Datenquellen"], plain: "Ein Ort, aus dem Daten kommen: Plattform-Logs, Bestellsystem, Helpdesk, Buchhaltung, CRM, eine Befragung. Jede ist nur relevant, wenn sich eine Entscheidung mit ihr ändern würde." },
  },
  {
    id: "decision-rule",
    title: "Decision rule, decision logic",
    match: ["decision rule", "decision rules", "decision logic", "decision logics"],
    plain: "A written rule for a recurring decision: which data, which threshold, which action and who acts. The same data then leads to the same action, whoever is on duty.",
    de: { title: "Entscheidungsregel, Entscheidungslogik", match: ["Entscheidungsregel", "Entscheidungsregeln", "Entscheidungslogik", "Entscheidungslogiken"], plain: "Eine schriftliche Regel für eine wiederkehrende Entscheidung: welche Daten, welcher Schwellenwert, welche Aktion und wer handelt. Dieselben Daten führen dann zur selben Handlung, egal wer Dienst hat." },
  },
  {
    id: "cdo",
    title: "CDO — Chief Data Officer",
    match: ["CDO", "Chief Data Officer"],
    plain: "The manager who answers for how a company collects, trusts and uses its data to decide.",
    de: { match: ["CDO", "Chief Data Officer"], plain: "Die Führungskraft, die dafür verantwortlich ist, wie ein Unternehmen seine Daten sammelt, ihnen vertraut und sie zum Entscheiden nutzt." },
  },
  {
    id: "customer-success",
    title: "Customer success",
    match: ["customer success", "Customer success"],
    plain: "The team that makes sure customers get value from what they bought: onboarding, regular check-ins, and calling when something looks wrong.",
    de: { title: "Customer Success", match: ["Customer Success"], plain: "Das Team, das dafür sorgt, dass Kunden den Wert dessen bekommen, was sie gekauft haben: Onboarding, regelmäßige Gespräche und ein Anruf, wenn etwas nicht stimmt." },
  },
  {
    id: "save-rate",
    title: "Save rate",
    match: ["save rate"],
    plain: "The share of customers flagged as at risk who stay after someone acted. It shows whether the early warnings lead to anything.",
    de: { title: "Save Rate", match: ["Save Rate"], plain: "Der Anteil der als gefährdet markierten Kunden, die bleiben, nachdem jemand gehandelt hat. Er zeigt, ob die Frühwarnungen zu etwas führen." },
  },
  {
    id: "api",
    title: "API",
    match: ["API"],
    plain: "An interface through which two software systems exchange data directly, without a person clicking through a screen.",
    de: { match: ["API"], plain: "Eine Schnittstelle, über die zwei Softwaresysteme direkt Daten austauschen, ohne dass ein Mensch sich durch einen Bildschirm klickt." },
  },
  {
    id: "lever-tests7",
    title: "Timeliness, reach, scale",
    match: ["Timeliness", "Reach", "Scale"],
    exactCase: true,
    plain: "Three of the four tests for an analysis component (with explanatory power). Timeliness: how early it warns. Reach: how many customers it covers. Scale: whether the cost per extra customer falls as the base grows.",
    de: { title: "Rechtzeitigkeit, Reichweite, Skalierung", match: ["Rechtzeitigkeit", "Reichweite", "Skalierung"], plain: "Drei der vier Tests für einen Analysebaustein (mit der Erklärungskraft). Rechtzeitigkeit: wie früh er warnt. Reichweite: wie viele Kunden er abdeckt. Skalierung: ob die Kosten pro zusätzlichem Kunden sinken, wenn die Basis wächst." },
  },

  // --- general terms kept from the course ------------------------------------------
  {
    id: "churn",
    title: "Churn, churn rate",
    match: ["churn", "churn rate", "churn rates", "churned"],
    plain: "Churn means customers leaving. The churn rate is the share who leave in a year.",
    example: "40 customers and a 35% churn rate: 14 customers leave.",
    de: {
      title: "Churn, Churn Rate (Abwanderungsquote)",
      match: ["Churn", "Churn Rate", "Churn Rates", "abwandern", "abwanderten", "Abwanderung"],
      plain: "Churn heißt, dass Kunden gehen. Die Churn Rate ist der Anteil, der in einem Jahr geht.",
      example: "40 Kunden und 35 % Churn Rate: 14 Kunden gehen.",
    },
  },
  {
    id: "crm",
    title: "CRM — customer relationship management system",
    match: ["CRM"],
    plain: "The software in which a sales team records every customer and deal: contacts, notes, orders, next steps. A health score can be shown in it.",
    de: { title: "CRM — Customer Relationship Management", match: ["CRM", "CRM-Einrichtung", "CRM-Daten"], plain: "Die Software, in der ein Vertriebsteam jeden Kunden und jeden Deal festhält: Kontakte, Notizen, Bestellungen, nächste Schritte. Ein Health Score kann darin angezeigt werden." },
  },
  {
    id: "mittelstand",
    title: "Mittelstand (mid-sized companies)",
    match: ["Mittelstand"],
    exactCase: true,
    plain: "The German word for mid-sized, often family-owned companies, the backbone of the German economy. Many have a small IT team or none.",
    de: { title: "Mittelstand", match: ["Mittelstand", "Mittelstandsunternehmen", "Mittelständler"], plain: "Mittelgroße, oft familiengeführte Unternehmen, das Rückgrat der deutschen Wirtschaft. Viele haben ein kleines oder gar kein IT-Team." },
  },
  {
    id: "go-live",
    title: "Go-live, onboarding, handover",
    match: ["go-live", "onboarding", "handover"],
    plain: "Go-live is the day a new service starts running for the customer. Onboarding is the first weeks around it. A handover is when sales passes the customer to the people who will look after it.",
    de: {
      title: "Go-live, Onboarding, Übergabe",
      match: ["Go-live", "Onboarding", "Übergabe"],
      plain: "Go-live ist der Tag, an dem ein neuer Service für den Kunden startet. Onboarding sind die ersten Wochen drumherum. Eine Übergabe ist, wenn der Vertrieb den Kunden an die Menschen weitergibt, die ihn betreuen.",
    },
  },
  {
    id: "tripwire",
    title: "Tripwire",
    match: ["tripwire"],
    plain: "A result agreed in advance that makes you change course: a metric, a threshold, a date and an action.",
    example: "If fewer than 45% of flagged customers stay by month 5, one rule is adjusted.",
    de: { title: "Tripwire", match: ["Tripwire", "Tripwires"], plain: "Ein vorab vereinbartes Ergebnis, bei dem Sie den Kurs ändern: eine Kennzahl, ein Schwellenwert, ein Datum und eine Aktion.", example: "Bleiben bis Monat 5 weniger als 45 % der markierten Kunden, wird eine Regel angepasst." },
  },
  {
    id: "staged",
    title: "Staged decision",
    match: ["staged", "stage it"],
    plain: "Deciding the direction now, but committing money in steps, each released only when a checkpoint is met.",
    from: "Courtney et al. 1997",
    de: { title: "Gestufte Entscheidung", match: ["stufenweise", "gestufte"], plain: "Die Richtung jetzt entscheiden, das Geld aber in Schritten binden, die jeweils erst freigegeben werden, wenn ein Kontrollpunkt erreicht ist." },
  },
  {
    id: "baseline",
    title: "Baseline",
    match: ["baseline", "baselines"],
    plain: "The value of a metric before you change anything. Without it you cannot tell whether a measure made a difference.",
    de: { title: "Baseline (Ausgangswert)", match: ["Baseline", "Ausgangswert", "Ausgangswerte"], plain: "Der Wert einer Kennzahl, bevor Sie etwas ändern. Ohne ihn können Sie nicht sagen, ob eine Maßnahme etwas bewirkt hat." },
  },
  {
    id: "owner",
    title: "Owner",
    match: ["owner", "owners"],
    plain: "The one person who can change a measure without asking anyone else, and who must act when its trigger fires.",
    de: { title: "Owner", match: ["Owner"], plain: "Die eine Person, die eine Maßnahme ändern kann, ohne jemanden zu fragen, und die handeln muss, wenn ihr Trigger auslöst." },
  },
  {
    id: "trigger",
    title: "Trigger",
    match: ["trigger", "triggers"],
    plain: "A written rule that says when the owner must act: a metric, a number, a date and an action.",
    de: { title: "Trigger", match: ["Trigger"], plain: "Eine schriftliche Regel, die sagt, wann der Owner handeln muss: eine Kennzahl, eine Zahl, ein Datum und eine Aktion." },
  },
  {
    id: "pickup",
    title: "Pickup point",
    match: ["pickup point"],
    plain: "The number and the date at which you look again at something you postponed. It turns “later” into a decision.",
    de: { title: "Pickup Point", match: ["Pickup Point"], plain: "Die Zahl und das Datum, zu dem Sie etwas Zurückgestelltes wieder ansehen. So wird aus „später“ eine Entscheidung." },
  },
  {
    id: "kpi",
    title: "KPI — key performance indicator",
    match: ["KPI", "KPIs"],
    plain: "One number that shows whether something is working. A good KPI measures the customer's response, not your own activity.",
    de: { match: ["KPI", "KPIs", "Kennzahl"], plain: "Eine Zahl, die zeigt, ob etwas funktioniert. Eine gute KPI misst die Reaktion des Kunden, nicht Ihre eigene Aktivität." },
  },
  {
    id: "premortem",
    title: "Premortem",
    match: ["premortem"],
    plain: "Before a plan starts, imagine it has failed and write down why. It brings hidden assumptions into the open.",
    from: "Klein 2007",
    de: { title: "Premortem", match: ["Premortem"], plain: "Bevor ein Plan startet, stellt man sich vor, er sei gescheitert, und schreibt auf, warum. So kommen versteckte Annahmen ans Licht." },
  },
  {
    id: "no-regret",
    title: "No-regret move",
    match: ["no-regret", "no-regret move", "no-regret items"],
    plain: "A step that is right whatever the uncertain facts turn out to be. You can take it now, while you wait for the rest of the evidence.",
    example: "A shared customer view helps whichever lever proves strongest later.",
    from: "Courtney et al. 1997",
    de: {
      title: "No-regret-Schritt",
      match: ["No-regret", "No-regret-Punkte", "No-regret-Schritt"],
      plain: "Ein Schritt, der richtig ist, egal wie die unsicheren Fakten ausfallen. Sie können ihn jetzt gehen, während Sie auf den Rest der Evidenz warten.",
      example: "Eine gemeinsame Kundensicht hilft jedem Hebel, der sich später als stärkster erweist.",
    },
  },

];

// --- lookup ---------------------------------------------------------------------

export const GLOSS_BY_ID: Record<string, GlossEntry> = Object.fromEntries(GLOSSARY.map((g) => [g.id, g]));

/** The texts of an entry in the active language (the English text where a German version is missing). */
export function glossText(g: GlossEntry): { title: string; plain: string; example?: string; from?: string } {
  if (getLang() === "de" && g.de) return { title: g.de.title ?? g.title, plain: g.de.plain, example: g.de.example, from: g.from };
  return { title: g.title, plain: g.plain, example: g.example, from: g.from };
}

const isAcronym = (s: string) => s === s.toUpperCase() && /[A-Z]/.test(s);
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function build(forms: (g: GlossEntry) => string[] | undefined) {
  const lookup = new Map<string, { entry: GlossEntry; exact: string | null }>();
  for (const g of GLOSSARY) for (const m of forms(g) ?? []) if (!lookup.has(m.toLowerCase())) lookup.set(m.toLowerCase(), { entry: g, exact: g.exactCase || isAcronym(m) ? m : null });
  const re = new RegExp(
    `(?<![\\p{L}\\p{N}_])(${[...lookup.keys()]
      .sort((a, b) => b.length - a.length)
      .map(escapeRe)
      .join("|")})(?![\\p{L}\\p{N}_])`,
    "giu",
  );
  return { lookup, re };
}

const EN = build((g) => g.match);
const DE = build((g) => g.de?.match);

/** lowercase written form → its entry, and whether that form must be matched exactly. */
export const GLOSS_LOOKUP = EN.lookup;
export const GLOSS_RE = EN.re;
export const GLOSS_LOOKUP_DE = DE.lookup;
export const GLOSS_RE_DE = DE.re;
