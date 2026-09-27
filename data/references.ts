import { bi, t } from "@/lib/lang";

/**
 * Day 7 reference list. Cards cite by key; each `References` accordion shows the union of what its own cards cite. Every entry is a
 * published work or an official legal text cited by its usual reference; the bracketed note says what the card takes from it.
 */
export type RefKey =
  | "davenport2007"
  | "kahneman2011"
  | "ackoff1989"
  | "rowley2007"
  | "mcafee2012"
  | "boyd2012"
  | "gdpr2016"
  | "provost2013"
  | "neslin2006"
  | "fader2005"
  | "ascarza2018"
  | "pearl2018"
  | "tetlock2015"
  | "hubbard2014"
  | "dama2017"
  | "kohavi2020"
  | "courtney1997"
  | "klein2007"
  | "doran1981";

export type Reference = { key: RefKey; chip: string; full: string };

const r = (key: RefKey, chip: string, en: string, de: string) => ({ key, chip, full: t(en, de) });

export const REFERENCES: Record<RefKey, Reference> = bi({
  davenport2007: r("davenport2007", "Davenport & Harris 2007", "Davenport, T. H., & Harris, J. G. (2007). Competing on Analytics: The New Science of Winning. Harvard Business School Press. (Analytics as a competitive capability; decisions based on data rather than on experience alone.)", "Davenport, T. H., & Harris, J. G. (2007). Competing on Analytics: The New Science of Winning. Harvard Business School Press. (Analytik als Wettbewerbsfähigkeit; Entscheidungen auf Datenbasis statt nur aus Erfahrung.)"),
  kahneman2011: r("kahneman2011", "Kahneman 2011", "Kahneman, D. (2011). Thinking, Fast and Slow. Farrar, Straus and Giroux. (Why vivid, memorable cases outweigh base rates in human judgement.)", "Kahneman, D. (2011). Thinking, Fast and Slow. Farrar, Straus and Giroux. (Warum lebhafte, einprägsame Fälle im menschlichen Urteil schwerer wiegen als Basisraten.)"),
  ackoff1989: r("ackoff1989", "Ackoff 1989", "Ackoff, R. L. (1989). From data to wisdom. Journal of Applied Systems Analysis, 16, 3–9. (The hierarchy from data to information, knowledge and understanding.)", "Ackoff, R. L. (1989). From data to wisdom. Journal of Applied Systems Analysis, 16, 3–9. (Die Stufen von Daten über Information zu Wissen und Verständnis.)"),
  rowley2007: r("rowley2007", "Rowley 2007", "Rowley, J. (2007). The wisdom hierarchy: Representations of the DIKW hierarchy. Journal of Information Science, 33(2), 163–180. (How the data–information–knowledge ladder is defined across the literature.)", "Rowley, J. (2007). The wisdom hierarchy: Representations of the DIKW hierarchy. Journal of Information Science, 33(2), 163–180. (Wie die Leiter Daten–Information–Wissen in der Literatur definiert wird.)"),
  mcafee2012: r("mcafee2012", "McAfee & Brynjolfsson 2012", "McAfee, A., & Brynjolfsson, E. (2012). Big data: The management revolution. Harvard Business Review, 90(10), 60–68. (Volume, velocity and variety; data-driven firms decide better, if leaders ask what the data says.)", "McAfee, A., & Brynjolfsson, E. (2012). Big data: The management revolution. Harvard Business Review, 90(10), 60–68. (Volumen, Geschwindigkeit und Vielfalt; datengetriebene Firmen entscheiden besser, wenn Führungskräfte fragen, was die Daten sagen.)"),
  boyd2012: r("boyd2012", "boyd & Crawford 2012", "boyd, d., & Crawford, K. (2012). Critical questions for big data. Information, Communication & Society, 15(5), 662–679. (Bigger data is not automatically better data; bias, gaps and context.)", "boyd, d., & Crawford, K. (2012). Critical questions for big data. Information, Communication & Society, 15(5), 662–679. (Größere Daten sind nicht automatisch bessere Daten; Verzerrung, Lücken und Kontext.)"),
  gdpr2016: r("gdpr2016", "GDPR 2016", "Regulation (EU) 2016/679 of the European Parliament and of the Council (General Data Protection Regulation), Art. 5 (purpose limitation, data minimisation) and Art. 22 (automated individual decisions).", "Verordnung (EU) 2016/679 des Europäischen Parlaments und des Rates (Datenschutz-Grundverordnung, DSGVO), Art. 5 (Zweckbindung, Datenminimierung) und Art. 22 (automatisierte Einzelentscheidungen)."),
  provost2013: r("provost2013", "Provost & Fawcett 2013", "Provost, F., & Fawcett, T. (2013). Data Science for Business. O'Reilly. (Base rates, lift and expected value as the basic tools of a forecast.)", "Provost, F., & Fawcett, T. (2013). Data Science for Business. O'Reilly. (Basisraten, Lift und Erwartungswert als Grundwerkzeuge einer Prognose.)"),
  neslin2006: r("neslin2006", "Neslin et al. 2006", "Neslin, S. A., Gupta, S., Kamakura, W., Lu, J., & Mason, C. H. (2006). Defection detection: Measuring and understanding the predictive accuracy of customer churn models. Journal of Marketing Research, 43(2), 204–211. (Churn models are judged by lift: how much better they find leavers than chance.)", "Neslin, S. A., Gupta, S., Kamakura, W., Lu, J., & Mason, C. H. (2006). Defection detection: Measuring and understanding the predictive accuracy of customer churn models. Journal of Marketing Research, 43(2), 204–211. (Churn-Modelle werden am Lift gemessen: wie viel besser sie Abwanderer finden als der Zufall.)"),
  fader2005: r("fader2005", "Fader et al. 2005", "Fader, P. S., Hardie, B. G. S., & Lee, K. L. (2005). RFM and CLV: Using iso-value curves for customer base analysis. Journal of Marketing Research, 42(4), 415–430. (Recency, frequency and monetary value as the core of behavioural customer data.)", "Fader, P. S., Hardie, B. G. S., & Lee, K. L. (2005). RFM and CLV: Using iso-value curves for customer base analysis. Journal of Marketing Research, 42(4), 415–430. (Aktualität, Häufigkeit und Wert als Kern verhaltensbasierter Kundendaten.)"),
  ascarza2018: r("ascarza2018", "Ascarza et al. 2018", "Ascarza, E., Neslin, S. A., Netzer, O., et al. (2018). In pursuit of enhanced customer retention management: Review, key issues, and future directions. Customer Needs and Solutions, 5, 65–81. (Target the customers an intervention can change, not only those most likely to leave.)", "Ascarza, E., Neslin, S. A., Netzer, O., et al. (2018). In pursuit of enhanced customer retention management: Review, key issues, and future directions. Customer Needs and Solutions, 5, 65–81. (Die Kunden ansprechen, die eine Maßnahme verändern kann, nicht nur die mit dem höchsten Abwanderungsrisiko.)"),
  pearl2018: r("pearl2018", "Pearl & Mackenzie 2018", "Pearl, J., & Mackenzie, D. (2018). The Book of Why. Basic Books. (Correlation is not causation; a third factor can cause both.)", "Pearl, J., & Mackenzie, D. (2018). The Book of Why. Basic Books. (Korrelation ist nicht Kausalität; ein dritter Faktor kann beides verursachen.)"),
  tetlock2015: r("tetlock2015", "Tetlock & Gardner 2015", "Tetlock, P. E., & Gardner, D. (2015). Superforecasting: The Art and Science of Prediction. Crown. (Forecasts improve only when they are checked against outcomes.)", "Tetlock, P. E., & Gardner, D. (2015). Superforecasting: The Art and Science of Prediction. Crown. (Prognosen werden nur besser, wenn sie mit Ergebnissen abgeglichen werden.)"),
  hubbard2014: r("hubbard2014", "Hubbard 2014", "Hubbard, D. W. (2014). How to Measure Anything, 3rd ed. Wiley. (Start from the decision; measure what would change it.)", "Hubbard, D. W. (2014). How to Measure Anything, 3. Aufl. Wiley. (Von der Entscheidung ausgehen; messen, was sie ändern würde.)"),
  dama2017: r("dama2017", "DAMA 2017", "DAMA International (2017). DAMA-DMBOK: Data Management Body of Knowledge, 2nd ed. Technics Publications. (Data quality dimensions and data ownership.)", "DAMA International (2017). DAMA-DMBOK: Data Management Body of Knowledge, 2. Aufl. Technics Publications. (Dimensionen der Datenqualität und Datenverantwortung.)"),
  kohavi2020: r("kohavi2020", "Kohavi et al. 2020", "Kohavi, R., Tang, D., & Xu, Y. (2020). Trustworthy Online Controlled Experiments. Cambridge University Press. (Test a weak signal with a small controlled trial before scaling an action on it.)", "Kohavi, R., Tang, D., & Xu, Y. (2020). Trustworthy Online Controlled Experiments. Cambridge University Press. (Ein schwaches Signal mit einem kleinen kontrollierten Test prüfen, bevor man eine Maßnahme darauf ausweitet.)"),
  courtney1997: r("courtney1997", "Courtney et al. 1997", "Courtney, H., Kirkland, J., & Viguerie, P. (1997). Strategy under uncertainty. Harvard Business Review, 75(6), 67–79. (Match the commitment to how much is known; no-regret moves first.)", "Courtney, H., Kirkland, J., & Viguerie, P. (1997). Strategy under uncertainty. Harvard Business Review, 75(6), 67–79. (Die Festlegung daran ausrichten, wie viel man weiß; No-regret-Schritte zuerst.)"),
  klein2007: r("klein2007", "Klein 2007", "Klein, G. (2007). Performing a project premortem. Harvard Business Review, 85(9), 18–19. (Imagine the plan has failed and write down why, before it starts.)", "Klein, G. (2007). Performing a project premortem. Harvard Business Review, 85(9), 18–19. (Sich vorstellen, der Plan sei gescheitert, und aufschreiben warum, bevor er startet.)"),
  doran1981: r("doran1981", "Doran 1981", "Doran, G. T. (1981). There's a S.M.A.R.T. way to write management's goals and objectives. Management Review, 70(11), 35–36.", "Doran, G. T. (1981). There's a S.M.A.R.T. way to write management's goals and objectives. Management Review, 70(11), 35–36."),
});

export const refFull = (key: RefKey) => REFERENCES[key].full;
export const REFERENCE_ORDER: RefKey[] = Object.keys(REFERENCES) as RefKey[];
