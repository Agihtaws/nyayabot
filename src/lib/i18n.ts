import { Language } from "@/types";

/**
 * Lightweight static-UI i18n.
 *
 * This is separate from the AI-generated content translation in
 * lib/utils/translate.ts (which translates the actual analysis results
 * coming back from Gemini/Groq/Mistral). This file covers everything
 * that is hardcoded in the UI — buttons, labels, headers, footer text —
 * so that selecting Tamil or Hindi changes the *whole* app, not just
 * the AI-generated parts of the results page.
 *
 * Usage:
 *   const t = useTranslation(language);
 *   t("nav.tagline")
 */

export const dictionary = {
  // ── Navbar ──────────────────────────────────────────────────────
  "nav.tagline": {
    english: "Understand any legal notice",
    tamil: "எந்த சட்ட அறிவிப்பையும் புரிந்துகொள்ளுங்கள்",
    hindi: "कोई भी कानूनी नोटिस समझें",
  },
  "nav.analyzeAnother": {
    english: "Analyze Another",
    tamil: "மற்றொன்றை பகுப்பாய்வு செய்யவும்",
    hindi: "दूसरा विश्लेषण करें",
  },
  "nav.new": {
    english: "New",
    tamil: "புதியது",
    hindi: "नया",
  },

  // ── Landing page ────────────────────────────────────────────────
  "home.badge": {
    english: "Free legal aid, powered by AI",
    tamil: "AI மூலம் இயக்கப்படும் இலவச சட்ட உதவி",
    hindi: "AI द्वारा संचालित मुफ्त कानूनी सहायता",
  },
  "home.heading": {
    english: "Got a legal notice you don't understand?",
    tamil: "உங்களுக்குப் புரியாத சட்ட அறிவிப்பு வந்துள்ளதா?",
    hindi: "क्या आपको कोई कानूनी नोटिस मिला है जो समझ में नहीं आ रहा?",
  },
  "home.subheading": {
    english:
      "Upload it. We'll explain what it means, your rights under Indian law, and what to do next — in Tamil, Hindi, or English.",
    tamil:
      "அதை பதிவேற்றுங்கள். அது என்ன அர்த்தம், இந்திய சட்டத்தின் கீழ் உங்கள் உரிமைகள், மற்றும் அடுத்து என்ன செய்ய வேண்டும் என்பதை தமிழ், இந்தி அல்லது ஆங்கிலத்தில் விளக்குவோம்.",
    hindi:
      "इसे अपलोड करें। हम बताएंगे कि इसका मतलब क्या है, भारतीय कानून के तहत आपके अधिकार क्या हैं, और आगे क्या करना है — तमिल, हिंदी या अंग्रेज़ी में।",
  },
  "home.bilingualLine": {
    english: "உங்கள் உரிமைகளை அறியுங்கள் · अपने अधिकार जानें",
    tamil: "உங்கள் உரிமைகளை அறியுங்கள் · अपने अधिकार जानें",
    hindi: "உங்கள் உரிமைகளை அறியுங்கள் · अपने अधिकार जानें",
  },
  "home.docType.rental": {
    english: "Rental Notices",
    tamil: "வாடகை அறிவிப்புகள்",
    hindi: "किराया नोटिस",
  },
  "home.docType.tax": {
    english: "Tax Demands",
    tamil: "வரி கோரிக்கைகள்",
    hindi: "कर मांग",
  },
  "home.docType.termination": {
    english: "Termination Letters",
    tamil: "பணி நீக்க கடிதங்கள்",
    hindi: "नौकरी समाप्ति पत्र",
  },
  "home.docType.summons": {
    english: "Court Summons",
    tamil: "நீதிமன்ற ஆணைகள்",
    hindi: "न्यायालय समन",
  },
  "home.docType.government": {
    english: "Government Notices",
    tamil: "அரசு அறிவிப்புகள்",
    hindi: "सरकारी नोटिस",
  },
  "home.docType.consumer": {
    english: "Consumer Complaints",
    tamil: "நுகர்வோர் புகார்கள்",
    hindi: "उपभोक्ता शिकायतें",
  },
  "home.stats.cases": {
    english: "Pending court cases in India",
    tamil: "இந்தியாவில் நிலுவையில் உள்ள வழக்குகள்",
    hindi: "भारत में लंबित अदालती मामले",
  },
  "home.stats.languages": {
    english: "Languages — Tamil, Hindi, English",
    tamil: "மொழிகள் — தமிழ், இந்தி, ஆங்கிலம்",
    hindi: "भाषाएं — तमिल, हिंदी, अंग्रेज़ी",
  },
  "home.stats.free": {
    english: "No registration needed",
    tamil: "பதிவு தேவையில்லை",
    hindi: "पंजीकरण की आवश्यकता नहीं",
  },
  "home.howItWorks.title": {
    english: "How it works",
    tamil: "இது எப்படி செயல்படுகிறது",
    hindi: "यह कैसे काम करता है",
  },
  "home.howItWorks.subtitle": {
    english: "Three steps, usually done in under 30 seconds",
    tamil: "மூன்று படிகள், பொதுவாக 30 வினாடிகளுக்கும் குறைவாக முடிக்கப்படும்",
    hindi: "तीन चरण, आम तौर पर 30 सेकंड से भी कम समय में पूरे होते हैं",
  },
  "home.step1.title": {
    english: "Upload your notice",
    tamil: "உங்கள் அறிவிப்பை பதிவேற்றவும்",
    hindi: "अपना नोटिस अपलोड करें",
  },
  "home.step1.desc": {
    english:
      "A PDF, a photo from WhatsApp, or just paste the text. Rental notice, tax demand, termination letter — any of it.",
    tamil:
      "ஒரு PDF, WhatsApp புகைப்படம், அல்லது வெறுமனே உரையை ஒட்டவும். வாடகை அறிவிப்பு, வரி கோரிக்கை, பணி நீக்க கடிதம் — எதுவாக இருந்தாலும்.",
    hindi:
      "एक PDF, WhatsApp से एक फोटो, या सिर्फ टेक्स्ट पेस्ट करें। किराया नोटिस, कर मांग, नौकरी समाप्ति पत्र — कुछ भी।",
  },
  "home.step2.title": {
    english: "We check it against Indian law",
    tamil: "இந்திய சட்டத்திற்கு எதிராக நாங்கள் அதை சரிபார்க்கிறோம்",
    hindi: "हम इसे भारतीय कानून के विरुद्ध जांचते हैं",
  },
  "home.step2.desc": {
    english:
      "Your document is matched against the relevant acts, sections, and how courts have ruled on similar cases.",
    tamil:
      "உங்கள் ஆவணம் தொடர்புடைய சட்டங்கள், பிரிவுகள், மற்றும் இதே போன்ற வழக்குகளில் நீதிமன்றங்கள் எவ்வாறு தீர்ப்பளித்துள்ளன என்பதற்கு எதிராக ஒப்பிடப்படுகிறது.",
    hindi:
      "आपके दस्तावेज़ की तुलना संबंधित अधिनियमों, धाराओं और इसी तरह के मामलों में न्यायालयों के फैसलों से की जाती है।",
  },
  "home.step3.title": {
    english: "Get your rights, in plain language",
    tamil: "உங்கள் உரிமைகளை எளிய மொழியில் பெறுங்கள்",
    hindi: "अपने अधिकार सरल भाषा में जानें",
  },
  "home.step3.desc": {
    english:
      "What it means, what you're entitled to, and exactly what to do next — no legal jargon, in your language.",
    tamil:
      "அது என்ன அர்த்தம், உங்களுக்கு என்ன உரிமை உண்டு, மற்றும் அடுத்து என்ன செய்ய வேண்டும் என்பதை — சட்ட சொற்கள் இல்லாமல், உங்கள் மொழியில்.",
    hindi:
      "इसका मतलब क्या है, आप किस चीज़ के हकदार हैं, और आगे क्या करना है — कोई कानूनी जटिल शब्द नहीं, आपकी भाषा में।",
  },
  "home.footer.disclaimer": {
    english:
      "NyayaBot provides AI-generated information only. Not a substitute for professional legal advice.",
    tamil:
      "NyayaBot AI-உருவாக்கிய தகவலை மட்டுமே வழங்குகிறது. இது தொழில்முறை சட்ட ஆலோசனைக்கு மாற்றாக இல்லை.",
    hindi:
      "NyayaBot केवल AI-जनित जानकारी प्रदान करता है। यह पेशेवर कानूनी सलाह का विकल्प नहीं है।",
  },
  "home.footer.event": {
    english: "Youth Code x AI 2026",
    tamil: "Youth Code x AI 2026",
    hindi: "Youth Code x AI 2026",
  },

  // ── Upload section ──────────────────────────────────────────────
  "upload.tab.pdf": {
    english: "PDF",
    tamil: "PDF",
    hindi: "PDF",
  },
  "upload.tab.photo": {
    english: "Photo",
    tamil: "புகைப்படம்",
    hindi: "फोटो",
  },
  "upload.tab.text": {
    english: "Text",
    tamil: "உரை",
    hindi: "टेक्स्ट",
  },
  "upload.pdf.dropLabel": {
    english: "Drop your PDF here",
    tamil: "உங்கள் PDF-ஐ இங்கே விடவும்",
    hindi: "अपनी PDF यहाँ छोड़ें",
  },
  "upload.pdf.hint": {
    english: "or tap to browse · max 5MB",
    tamil: "அல்லது உலாவ தட்டவும் · அதிகபட்சம் 5MB",
    hindi: "या ब्राउज़ करने के लिए टैप करें · अधिकतम 5MB",
  },
  "upload.pdf.badge": {
    english: "Rental notices · Tax notices · Legal letters",
    tamil: "வாடகை அறிவிப்புகள் · வரி அறிவிப்புகள் · சட்ட கடிதங்கள்",
    hindi: "किराया नोटिस · कर नोटिस · कानूनी पत्र",
  },
  "upload.image.dropLabel": {
    english: "Drop your photo here",
    tamil: "உங்கள் புகைப்படத்தை இங்கே விடவும்",
    hindi: "अपनी फोटो यहाँ छोड़ें",
  },
  "upload.image.hint": {
    english: "or tap to browse · max 5MB",
    tamil: "அல்லது உலாவ தட்டவும் · அதிகபட்சம் 5MB",
    hindi: "या ब्राउज़ करने के लिए टैप करें · अधिकतम 5MB",
  },
  "upload.image.badge": {
    english: "WhatsApp photos · Scanned notices · Screenshots",
    tamil: "WhatsApp புகைப்படங்கள் · ஸ்கேன் செய்யப்பட்ட அறிவிப்புகள் · ஸ்க்ரீன்ஷாட்கள்",
    hindi: "WhatsApp फोटो · स्कैन किए गए नोटिस · स्क्रीनशॉट",
  },
  "upload.text.label": {
    english: "Paste your notice text",
    tamil: "உங்கள் அறிவிப்பு உரையை ஒட்டவும்",
    hindi: "अपना नोटिस टेक्स्ट पेस्ट करें",
  },
  "upload.text.hint": {
    english: "Or describe your situation in your own words",
    tamil: "அல்லது உங்கள் சூழ்நிலையை உங்கள் சொற்களில் விவரிக்கவும்",
    hindi: "या अपनी स्थिति को अपने शब्दों में बताएं",
  },
  "upload.text.placeholder": {
    english:
      "Example: My landlord sent me a notice saying I must vacate within 7 days. The notice says I violated clause 4 of my rental agreement...",
    tamil:
      "உதாரணம்: எனது வீட்டு உரிமையாளர் 7 நாட்களுக்குள் வெளியேற வேண்டும் என்று அறிவிப்பு அனுப்பினார். எனது வாடகை ஒப்பந்தத்தின் பிரிவு 4-ஐ மீறியதாக அறிவிப்பு கூறுகிறது...",
    hindi:
      "उदाहरण: मेरे मकान मालिक ने मुझे नोटिस भेजा कि मुझे 7 दिनों के भीतर मकान खाली करना होगा। नोटिस में कहा गया है कि मैंने अपने किराया समझौते के खंड 4 का उल्लंघन किया है...",
  },
  "upload.text.charCount": {
    english: "characters",
    tamil: "எழுத்துகள்",
    hindi: "अक्षर",
  },
  "upload.text.minChars": {
    english: "Need at least 20 characters",
    tamil: "குறைந்தது 20 எழுத்துகள் தேவை",
    hindi: "कम से कम 20 अक्षर आवश्यक हैं",
  },
  "upload.text.badge": {
    english: "Best for typed text you already have",
    tamil: "ஏற்கனவே உள்ள தட்டச்சு செய்யப்பட்ட உரைக்கு சிறந்தது",
    hindi: "टाइप किए गए टेक्स्ट के लिए सबसे उपयुक्त",
  },
  "upload.button.analyzing": {
    english: "Reading your document...",
    tamil: "உங்கள் ஆவணத்தைப் படிக்கிறோம்...",
    hindi: "आपका दस्तावेज़ पढ़ा जा रहा है...",
  },
  "upload.button.analyze": {
    english: "Analyze My Document →",
    tamil: "எனது ஆவணத்தை பகுப்பாய்வு செய்யவும் →",
    hindi: "मेरे दस्तावेज़ का विश्लेषण करें →",
  },
  "upload.footer": {
    english: "Processed securely. Never shared with third parties.",
    tamil: "பாதுகாப்பாக செயலாக்கப்படுகிறது. மூன்றாம் தரப்பினருடன் பகிரப்படாது.",
    hindi: "सुरक्षित रूप से प्रोसेस किया गया। किसी तीसरे पक्ष के साथ साझा नहीं किया जाता।",
  },
  "upload.toast.invalidPdf.title": {
    english: "Invalid file type",
    tamil: "தவறான கோப்பு வகை",
    hindi: "अमान्य फ़ाइल प्रकार",
  },
  "upload.toast.invalidPdf.desc": {
    english: "Please upload a PDF file",
    tamil: "தயவுசெய்து ஒரு PDF கோப்பை பதிவேற்றவும்",
    hindi: "कृपया एक PDF फ़ाइल अपलोड करें",
  },
  "upload.toast.invalidImage.desc": {
    english: "Please upload an image file",
    tamil: "தயவுசெய்து ஒரு படக் கோப்பை பதிவேற்றவும்",
    hindi: "कृपया एक इमेज फ़ाइल अपलोड करें",
  },
  "upload.toast.tooLarge.title": {
    english: "File too large",
    tamil: "கோப்பு மிகவும் பெரியது",
    hindi: "फ़ाइल बहुत बड़ी है",
  },
  "upload.toast.tooLargePdf.desc": {
    english: "Please upload a PDF under 5MB",
    tamil: "தயவுசெய்து 5MB-க்கும் குறைவான PDF-ஐ பதிவேற்றவும்",
    hindi: "कृपया 5MB से कम की PDF अपलोड करें",
  },
  "upload.toast.tooLargeImage.desc": {
    english: "Please upload an image under 5MB",
    tamil: "தயவுசெய்து 5MB-க்கும் குறைவான படத்தை பதிவேற்றவும்",
    hindi: "कृपया 5MB से कम की इमेज अपलोड करें",
  },
  "upload.toast.noFile.title": {
    english: "No file selected",
    tamil: "கோப்பு எதுவும் தேர்ந்தெடுக்கப்படவில்லை",
    hindi: "कोई फ़ाइल नहीं चुनी गई",
  },
  "upload.toast.noPdf.desc": {
    english: "Please upload a PDF first",
    tamil: "முதலில் ஒரு PDF-ஐ பதிவேற்றவும்",
    hindi: "कृपया पहले एक PDF अपलोड करें",
  },
  "upload.toast.noImage.desc": {
    english: "Please upload an image first",
    tamil: "முதலில் ஒரு படத்தை பதிவேற்றவும்",
    hindi: "कृपया पहले एक इमेज अपलोड करें",
  },
  "upload.toast.tooShort.title": {
    english: "Text too short",
    tamil: "உரை மிகவும் குறுகியது",
    hindi: "टेक्स्ट बहुत छोटा है",
  },
  "upload.toast.tooShort.desc": {
    english: "Please enter at least 20 characters",
    tamil: "தயவுசெய்து குறைந்தது 20 எழுத்துகளை உள்ளிடவும்",
    hindi: "कृपया कम से कम 20 अक्षर दर्ज करें",
  },
  "upload.toast.uploadFailed.title": {
    english: "Upload failed",
    tamil: "பதிவேற்றம் தோல்வியடைந்தது",
    hindi: "अपलोड विफल",
  },
  "upload.toast.tryAgain": {
    english: "Please try again",
    tamil: "தயவுசெய்து மீண்டும் முயற்சிக்கவும்",
    hindi: "कृपया फिर से प्रयास करें",
  },
  "upload.readyToAnalyze": {
    english: "Ready to analyze",
    tamil: "பகுப்பாய்வு செய்ய தயார்",
    hindi: "विश्लेषण के लिए तैयार",
  },

  // ── Analyzing page ──────────────────────────────────────────────
  "analyzing.title": {
    english: "Going through your document",
    tamil: "உங்கள் ஆவணத்தை பரிசோதிக்கிறோம்",
    hindi: "आपके दस्तावेज़ की जांच की जा रही है",
  },
  "analyzing.titleDone": {
    english: "All done!",
    tamil: "முடிந்தது!",
    hindi: "पूरा हो गया!",
  },
  "analyzing.subtitleNormal": {
    english: "This usually takes 10–20 seconds",
    tamil: "இது பொதுவாக 10–20 வினாடிகள் ஆகும்",
    hindi: "इसमें आम तौर पर 10–20 सेकंड लगते हैं",
  },
  "analyzing.subtitleSlow": {
    english: "Still working — translated documents take a little longer",
    tamil: "இன்னும் வேலை செய்கிறோம் — மொழிபெயர்க்கப்பட்ட ஆவணங்களுக்கு சிறிது அதிக நேரம் ஆகும்",
    hindi: "अभी भी काम कर रहे हैं — अनुवादित दस्तावेज़ों में थोड़ा अधिक समय लगता है",
  },
  "analyzing.subtitleDone": {
    english: "Taking you to your results...",
    tamil: "உங்கள் முடிவுகளுக்கு உங்களை அழைத்துச் செல்கிறோம்...",
    hindi: "आपको आपके परिणामों तक ले जाया जा रहा है...",
  },
  "analyzing.step1.title": {
    english: "Reading your document",
    tamil: "உங்கள் ஆவணத்தைப் படிக்கிறோம்",
    hindi: "आपका दस्तावेज़ पढ़ा जा रहा है",
  },
  "analyzing.step1.subtitle": {
    english: "Document Review",
    tamil: "ஆவண மறுபரிசீலனை",
    hindi: "दस्तावेज़ समीक्षा",
  },
  "analyzing.step1.task": {
    english: "Identifying the type of notice, key dates, and demands made against you...",
    tamil: "அறிவிப்பின் வகை, முக்கிய தேதிகள், மற்றும் உங்களுக்கு எதிரான கோரிக்கைகளை அடையாளம் காண்கிறோம்...",
    hindi: "नोटिस के प्रकार, महत्वपूर्ण तिथियों और आपके खिलाफ की गई मांगों की पहचान की जा रही है...",
  },
  "analyzing.step2.title": {
    english: "Checking the law",
    tamil: "சட்டத்தை சரிபார்க்கிறோம்",
    hindi: "कानून की जांच की जा रही है",
  },
  "analyzing.step2.subtitle": {
    english: "Legal Research",
    tamil: "சட்ட ஆராய்ச்சி",
    hindi: "कानूनी शोध",
  },
  "analyzing.step2.task": {
    english: "Matching your situation against Indian acts, sections, and precedent...",
    tamil: "உங்கள் சூழ்நிலையை இந்திய சட்டங்கள், பிரிவுகள், மற்றும் முன்னுதாரணங்களுக்கு எதிராக பொருத்துகிறோம்...",
    hindi: "आपकी स्थिति का भारतीय अधिनियमों, धाराओं और पूर्व निर्णयों से मिलान किया जा रहा है...",
  },
  "analyzing.step3.title": {
    english: "Working out your rights",
    tamil: "உங்கள் உரிமைகளை வகுக்கிறோம்",
    hindi: "आपके अधिकार तय किए जा रहे हैं",
  },
  "analyzing.step3.subtitle": {
    english: "Rights & Next Steps",
    tamil: "உரிமைகள் & அடுத்த படிகள்",
    hindi: "अधिकार और आगे के कदम",
  },
  "analyzing.step3.task": {
    english: "Translating the legal findings into plain next steps for you...",
    tamil: "சட்ட கண்டுபிடிப்புகளை உங்களுக்கான எளிய அடுத்த படிகளாக மாற்றுகிறோம்...",
    hindi: "कानूनी निष्कर्षों को आपके लिए सरल आगामी चरणों में बदला जा रहा है...",
  },
  "analyzing.status.done": {
    english: "Done",
    tamil: "முடிந்தது",
    hindi: "पूर्ण",
  },
  "analyzing.status.working": {
    english: "Working",
    tamil: "வேலை செய்கிறது",
    hindi: "कार्य जारी",
  },
  "analyzing.status.waiting": {
    english: "Waiting",
    tamil: "காத்திருக்கிறது",
    hindi: "प्रतीक्षा में",
  },
  "analyzing.complete": {
    english: "complete",
    tamil: "முடிந்தது",
    hindi: "पूर्ण",
  },
  "analyzing.error.title": {
    english: "Something went wrong",
    tamil: "ஏதோ தவறு நடந்தது",
    hindi: "कुछ गलत हो गया",
  },
  "analyzing.error.retry": {
    english: "Go back and try again",
    tamil: "திரும்பிச் சென்று மீண்டும் முயற்சிக்கவும்",
    hindi: "वापस जाएं और फिर से प्रयास करें",
  },

  // ── Result page ─────────────────────────────────────────────────
  "result.loading": {
    english: "Loading your results...",
    tamil: "உங்கள் முடிவுகள் ஏற்றப்படுகிறது...",
    hindi: "आपके परिणाम लोड हो रहे हैं...",
  },
  "result.notFound": {
    english: "Something went wrong",
    tamil: "ஏதோ தவறு நடந்தது",
    hindi: "कुछ गलत हो गया",
  },
  "result.goBack": {
    english: "Go Back",
    tamil: "திரும்பிச் செல்லவும்",
    hindi: "वापस जाएं",
  },
  "result.urgency.high": {
    english: "Act within 7 days",
    tamil: "7 நாட்களுக்குள் நடவடிக்கை எடுக்கவும்",
    hindi: "7 दिनों के भीतर कार्रवाई करें",
  },
  "result.urgency.medium": {
    english: "Act within 30 days",
    tamil: "30 நாட்களுக்குள் நடவடிக்கை எடுக்கவும்",
    hindi: "30 दिनों के भीतर कार्रवाई करें",
  },
  "result.urgency.low": {
    english: "No immediate deadline",
    tamil: "உடனடி காலக்கெடு இல்லை",
    hindi: "कोई तुरंत समय सीमा नहीं",
  },
  "result.heading": {
    english: "Here's what this means for you",
    tamil: "இது உங்களுக்கு என்ன அர்த்தம் என்பது இங்கே",
    hindi: "यहाँ बताया गया है कि इसका आपके लिए क्या मतलब है",
  },
  "result.generateLetter": {
    english: "Generate Response Letter",
    tamil: "பதில் கடிதத்தை உருவாக்கவும்",
    hindi: "जवाबी पत्र तैयार करें",
  },
  "result.askQuestion": {
    english: "Ask a Question",
    tamil: "ஒரு கேள்வி கேளுங்கள்",
    hindi: "एक सवाल पूछें",
  },
  "result.whatThisMeans": {
    english: "What This Document Means",
    tamil: "இந்த ஆவணம் என்ன அர்த்தம்",
    hindi: "इस दस्तावेज़ का मतलब क्या है",
  },
  "result.yourRights": {
    english: "Your Rights",
    tamil: "உங்கள் உரிமைகள்",
    hindi: "आपके अधिकार",
  },
  "result.whatToDoNext": {
    english: "What To Do Next",
    tamil: "அடுத்து என்ன செய்ய வேண்டும்",
    hindi: "आगे क्या करें",
  },
  "result.relevantLaws": {
    english: "Relevant Indian Laws",
    tamil: "தொடர்புடைய இந்திய சட்டங்கள்",
    hindi: "संबंधित भारतीय कानून",
  },
  "result.viewOnIndianKanoon": {
    english: "View on Indian Kanoon",
    tamil: "Indian Kanoon-இல் காண்க",
    hindi: "Indian Kanoon पर देखें",
  },
  "result.freeLegalAid": {
    english: "Free Legal Aid in India",
    tamil: "இந்தியாவில் இலவச சட்ட உதவி",
    hindi: "भारत में मुफ्त कानूनी सहायता",
  },
  "result.resource.nalsa": {
    english: "Free legal aid for all citizens",
    tamil: "அனைத்து குடிமக்களுக்கும் இலவச சட்ட உதவி",
    hindi: "सभी नागरिकों के लिए मुफ्त कानूनी सहायता",
  },
  "result.resource.ecourts": {
    english: "Track your case status online",
    tamil: "உங்கள் வழக்கு நிலையை ஆன்லைனில் கண்காணிக்கவும்",
    hindi: "अपने मामले की स्थिति ऑनलाइन देखें",
  },
  "result.resource.indiankanoon": {
    english: "Search Indian laws and judgments",
    tamil: "இந்திய சட்டங்கள் மற்றும் தீர்ப்புகளைத் தேடவும்",
    hindi: "भारतीय कानूनों और फैसलों की खोज करें",
  },
  "result.resource.tnslsa": {
    english: "Tamil Nadu legal aid authority",
    tamil: "தமிழ்நாடு சட்ட உதவி ஆணையம்",
    hindi: "तमिलनाडु कानूनी सहायता प्राधिकरण",
  },
  "result.disclaimer": {
    english:
      "NyayaBot provides AI-generated information only. Not a substitute for professional legal advice. For serious matters, always consult a qualified lawyer.",
    tamil:
      "NyayaBot AI-உருவாக்கிய தகவலை மட்டுமே வழங்குகிறது. இது தொழில்முறை சட்ட ஆலோசனைக்கு மாற்றாக இல்லை. முக்கியமான விஷயங்களுக்கு, எப்போதும் தகுதியான வழக்கறிஞரை அணுகவும்.",
    hindi:
      "NyayaBot केवल AI-जनित जानकारी प्रदान करता है। यह पेशेवर कानूनी सलाह का विकल्प नहीं है। गंभीर मामलों के लिए, हमेशा एक योग्य वकील से सलाह लें।",
  },

  // ── Document type labels (used as badge text on result page) ────
  "docType.rental_notice": {
    english: "rental notice",
    tamil: "வாடகை அறிவிப்பு",
    hindi: "किराया नोटिस",
  },
  "docType.tax_notice": {
    english: "tax notice",
    tamil: "வரி அறிவிப்பு",
    hindi: "कर नोटिस",
  },
  "docType.termination_letter": {
    english: "termination letter",
    tamil: "பணி நீக்க கடிதம்",
    hindi: "नौकरी समाप्ति पत्र",
  },
  "docType.court_summons": {
    english: "court summons",
    tamil: "நீதிமன்ற ஆணை",
    hindi: "न्यायालय समन",
  },
  "docType.consumer_complaint": {
    english: "consumer complaint",
    tamil: "நுகர்வோர் புகார்",
    hindi: "उपभोक्ता शिकायत",
  },
  "docType.government_notice": {
    english: "government notice",
    tamil: "அரசு அறிவிப்பு",
    hindi: "सरकारी नोटिस",
  },
  "docType.unknown": {
    english: "document",
    tamil: "ஆவணம்",
    hindi: "दस्तावेज़",
  },

  // ── Chat section ────────────────────────────────────────────────
  "chat.title": {
    english: "Have a question about this?",
    tamil: "இதைப் பற்றி உங்களுக்கு கேள்வி உள்ளதா?",
    hindi: "इस बारे में आपका कोई सवाल है?",
  },
  "chat.subtitle": {
    english: "Ask anything — we know the full details of your document",
    tamil: "எதையும் கேளுங்கள் — உங்கள் ஆவணத்தின் முழு விவரங்களும் எங்களுக்குத் தெரியும்",
    hindi: "कुछ भी पूछें — हमें आपके दस्तावेज़ का पूरा विवरण पता है",
  },
  "chat.tryAsking": {
    english: "Try asking:",
    tamil: "கேட்டுப் பாருங்கள்:",
    hindi: "पूछकर देखें:",
  },
  "chat.inputPlaceholder": {
    english: "Ask about your document...",
    tamil: "உங்கள் ஆவணத்தைப் பற்றி கேளுங்கள்...",
    hindi: "अपने दस्तावेज़ के बारे में पूछें...",
  },
  "chat.error": {
    english: "Sorry, I couldn't process that question. Please try again.",
    tamil: "மன்னிக்கவும், அந்த கேள்வியைச் செயலாக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
    hindi: "क्षमा करें, मैं उस सवाल को प्रोसेस नहीं कर सका। कृपया फिर से प्रयास करें।",
  },

  // ── Letter modal ────────────────────────────────────────────────
  "letter.title": {
    english: "Response Letter",
    tamil: "பதில் கடிதம்",
    hindi: "जवाबी पत्र",
  },
  "letter.subtitle": {
    english: "AI-drafted reply — review before sending",
    tamil: "AI வரைவு பதில் — அனுப்புவதற்கு முன் பரிசோதிக்கவும்",
    hindi: "AI द्वारा तैयार जवाब — भेजने से पहले जांच लें",
  },
  "letter.drafting": {
    english: "Drafting your letter...",
    tamil: "உங்கள் கடிதத்தை வரைகிறோம்...",
    hindi: "आपका पत्र तैयार किया जा रहा है...",
  },
  "letter.draftingSubtext": {
    english: "Writing a professional legal reply based on your rights",
    tamil: "உங்கள் உரிமைகளின் அடிப்படையில் ஒரு தொழில்முறை சட்ட பதிலை எழுதுகிறோம்",
    hindi: "आपके अधिकारों के आधार पर एक पेशेवर कानूनी जवाब लिखा जा रहा है",
  },
  "letter.closeRetry": {
    english: "Close and try again",
    tamil: "மூடி மீண்டும் முயற்சிக்கவும்",
    hindi: "बंद करें और फिर से प्रयास करें",
  },
  "letter.warning": {
    english:
      "Review carefully and fill in any [PLACEHOLDER] fields before sending. This is AI-generated — not a substitute for legal advice.",
    tamil:
      "அனுப்புவதற்கு முன் கவனமாக சரிபார்த்து [PLACEHOLDER] புலங்களை நிரப்பவும். இது AI-உருவாக்கியது — சட்ட ஆலோசனைக்கு மாற்றாக இல்லை.",
    hindi:
      "भेजने से पहले ध्यान से जांचें और किसी भी [PLACEHOLDER] फ़ील्ड को भरें। यह AI-जनित है — कानूनी सलाह का विकल्प नहीं है।",
  },
  "letter.copy": {
    english: "Copy",
    tamil: "நகலெடு",
    hindi: "कॉपी करें",
  },
  "letter.downloadTxt": {
    english: ".txt",
    tamil: ".txt",
    hindi: ".txt",
  },
  "letter.downloadPdf": {
    english: "Download PDF",
    tamil: "PDF பதிவிறக்கவும்",
    hindi: "PDF डाउनलोड करें",
  },
  "letter.toast.copied": {
    english: "Letter copied to clipboard",
    tamil: "கடிதம் கிளிப்போர்டுக்கு நகலெடுக்கப்பட்டது",
    hindi: "पत्र क्लिपबोर्ड पर कॉपी किया गया",
  },
  "letter.toast.downloadedTxt": {
    english: "Letter downloaded as .txt",
    tamil: ".txt ஆக கடிதம் பதிவிறக்கப்பட்டது",
    hindi: "पत्र .txt के रूप में डाउनलोड किया गया",
  },
  "letter.toast.downloadedPdf": {
    english: "Letter downloaded as PDF",
    tamil: "PDF ஆக கடிதம் பதிவிறக்கப்பட்டது",
    hindi: "पत्र PDF के रूप में डाउनलोड किया गया",
  },
  "letter.toast.pdfFailedTitle": {
    english: "Couldn't create PDF",
    tamil: "PDF உருவாக்க முடியவில்லை",
    hindi: "PDF नहीं बना सका",
  },
  "letter.toast.pdfFailedDesc": {
    english: "Try the .txt download instead",
    tamil: "அதற்கு பதிலாக .txt பதிவிறக்கத்தை முயற்சிக்கவும்",
    hindi: "इसके बजाय .txt डाउनलोड का प्रयास करें",
  },

  // ── Suggested chat questions, by document type ─────────────────
  "suggest.rental.q1": {
    english: "Can my landlord forcibly evict me without a court order?",
    tamil: "நீதிமன்ற உத்தரவு இல்லாமல் என் வீட்டு உரிமையாளர் என்னை வெளியேற்ற முடியுமா?",
    hindi: "क्या मेरा मकान मालिक अदालत के आदेश के बिना मुझे जबरन बेदखल कर सकता है?",
  },
  "suggest.rental.q2": {
    english: "What if I can't pay the full amount in time?",
    tamil: "நேரத்திற்கு முழுத் தொகையையும் செலுத்த முடியாவிட்டால் என்ன செய்வது?",
    hindi: "अगर मैं समय पर पूरी राशि नहीं चुका सकता तो क्या होगा?",
  },
  "suggest.rental.q3": {
    english: "Do I need a lawyer for this?",
    tamil: "இதற்கு எனக்கு வழக்கறிஞர் தேவையா?",
    hindi: "क्या मुझे इसके लिए वकील की आवश्यकता है?",
  },
  "suggest.rental.q4": {
    english: "What happens if I just ignore this notice?",
    tamil: "இந்த அறிவிப்பை நான் கவனிக்காமல் இருந்தால் என்ன நடக்கும்?",
    hindi: "अगर मैं इस नोटिस को नज़रअंदाज़ कर दूं तो क्या होगा?",
  },
  "suggest.tax.q1": {
    english: "What if I can't pay the full amount within the deadline?",
    tamil: "காலக்கெடுவுக்குள் முழுத் தொகையையும் செலுத்த முடியாவிட்டால் என்ன செய்வது?",
    hindi: "अगर मैं समय सीमा के भीतर पूरी राशि नहीं चुका सकता तो क्या होगा?",
  },
  "suggest.tax.q2": {
    english: "Can I request a payment plan or extension?",
    tamil: "கட்டணத் திட்டம் அல்லது கால அவகாசம் கேட்க முடியுமா?",
    hindi: "क्या मैं भुगतान योजना या समय सीमा बढ़ाने का अनुरोध कर सकता हूं?",
  },
  "suggest.tax.q3": {
    english: "What happens if I ignore this notice?",
    tamil: "இந்த அறிவிப்பை நான் கவனிக்காமல் இருந்தால் என்ன நடக்கும்?",
    hindi: "अगर मैं इस नोटिस को नज़रअंदाज़ कर दूं तो क्या होगा?",
  },
  "suggest.tax.q4": {
    english: "Do I need a chartered accountant or lawyer for this?",
    tamil: "இதற்கு எனக்கு பட்டயக் கணக்காளர் அல்லது வழக்கறிஞர் தேவையா?",
    hindi: "क्या मुझे इसके लिए चार्टर्ड अकाउंटेंट या वकील की आवश्यकता है?",
  },
  "suggest.termination.q1": {
    english: "Can my employer terminate me without notice?",
    tamil: "எனது முதலாளி எனக்கு அறிவிப்பு இல்லாமல் பணி நீக்கம் செய்ய முடியுமா?",
    hindi: "क्या मेरा नियोक्ता मुझे नोटिस के बिना नौकरी से हटा सकता है?",
  },
  "suggest.termination.q2": {
    english: "Am I entitled to severance pay?",
    tamil: "எனக்கு பணிநீக்க இழப்பீடு பெற உரிமை உண்டா?",
    hindi: "क्या मैं मुआवजे का हकदार हूं?",
  },
  "suggest.termination.q3": {
    english: "Can I challenge this termination?",
    tamil: "இந்த பணி நீக்கத்தை நான் எதிர்க்க முடியுமா?",
    hindi: "क्या मैं इस बर्खास्तगी को चुनौती दे सकता हूं?",
  },
  "suggest.termination.q4": {
    english: "What happens if I don't respond to this?",
    tamil: "நான் இதற்கு பதிலளிக்காவிட்டால் என்ன நடக்கும்?",
    hindi: "अगर मैं इसका जवाब नहीं देता तो क्या होगा?",
  },
  "suggest.summons.q1": {
    english: "What happens if I don't appear in court?",
    tamil: "நான் நீதிமன்றத்தில் ஆஜராகாவிட்டால் என்ன நடக்கும்?",
    hindi: "अगर मैं अदालत में पेश नहीं होता तो क्या होगा?",
  },
  "suggest.summons.q2": {
    english: "Can I get the date postponed?",
    tamil: "தேதியை தள்ளி வைக்க முடியுமா?",
    hindi: "क्या मैं तारीख आगे बढ़ा सकता हूं?",
  },
  "suggest.summons.q3": {
    english: "Do I need a lawyer to attend?",
    tamil: "கூட்டத்தில் கூட இருக்க எனக்கு வழக்கறிஞர் தேவையா?",
    hindi: "क्या मुझे उपस्थित होने के लिए वकील की आवश्यकता है?",
  },
  "suggest.summons.q4": {
    english: "What should I bring with me?",
    tamil: "நான் என்னுடன் என்ன கொண்டு வர வேண்டும்?",
    hindi: "मुझे अपने साथ क्या लाना चाहिए?",
  },
  "suggest.consumer.q1": {
    english: "What if I disagree with this complaint?",
    tamil: "இந்த புகாரை நான் ஏற்காவிட்டால் என்ன செய்வது?",
    hindi: "अगर मैं इस शिकायत से सहमत नहीं हूं तो क्या करूं?",
  },
  "suggest.consumer.q2": {
    english: "Do I have to respond within the deadline?",
    tamil: "காலக்கெடுவுக்குள் நான் பதிலளிக்க வேண்டுமா?",
    hindi: "क्या मुझे समय सीमा के भीतर जवाब देना होगा?",
  },
  "suggest.consumer.q3": {
    english: "Can this affect my business license?",
    tamil: "இது எனது வணிக உரிமத்தை பாதிக்குமா?",
    hindi: "क्या यह मेरे व्यापार लाइसेंस को प्रभावित कर सकता है?",
  },
  "suggest.consumer.q4": {
    english: "Do I need a lawyer for this?",
    tamil: "இதற்கு எனக்கு வழக்கறிஞர் தேவையா?",
    hindi: "क्या मुझे इसके लिए वकील की आवश्यकता है?",
  },
  "suggest.government.q1": {
    english: "What happens if I don't respond in time?",
    tamil: "நேரத்திற்கு பதிலளிக்காவிட்டால் என்ன நடக்கும்?",
    hindi: "अगर मैं समय पर जवाब नहीं देता तो क्या होगा?",
  },
  "suggest.government.q2": {
    english: "Can I request more time to comply?",
    tamil: "இணங்க அதிக நேரம் கேட்க முடியுமா?",
    hindi: "क्या मैं पालन करने के लिए अधिक समय मांग सकता हूं?",
  },
  "suggest.government.q3": {
    english: "Who can I contact to clarify this notice?",
    tamil: "இந்த அறிவிப்பை தெளிவுபடுத்த யாரை தொடர்பு கொள்ளலாம்?",
    hindi: "इस नोटिस को स्पष्ट करने के लिए मैं किससे संपर्क करूं?",
  },
  "suggest.government.q4": {
    english: "Do I need a lawyer for this?",
    tamil: "இதற்கு எனக்கு வழக்கறிஞர் தேவையா?",
    hindi: "क्या मुझे इसके लिए वकील की आवश्यकता है?",
  },
  "suggest.unknown.q1": {
    english: "What's the most urgent thing I should do first?",
    tamil: "நான் முதலில் செய்ய வேண்டிய மிக அவசரமான விஷயம் என்ன?",
    hindi: "मुझे सबसे पहले क्या करना सबसे ज़रूरी है?",
  },
  "suggest.unknown.q2": {
    english: "What happens if I miss the deadline?",
    tamil: "காலக்கெடுவை தவறவிட்டால் என்ன நடக்கும்?",
    hindi: "अगर मैं समय सीमा चूक जाता हूं तो क्या होगा?",
  },
  "suggest.unknown.q3": {
    english: "Do I need a lawyer for this?",
    tamil: "இதற்கு எனக்கு வழக்கறிஞர் தேவையா?",
    hindi: "क्या मुझे इसके लिए वकील की आवश्यकता है?",
  },
  "suggest.unknown.q4": {
    english: "Who can give me free legal help with this?",
    tamil: "இதற்கு இலவச சட்ட உதவியை யார் வழங்க முடியும்?",
    hindi: "इसके लिए मुझे मुफ्त कानूनी मदद कौन दे सकता है?",
  },
} as const;

export type DictionaryKey = keyof typeof dictionary;

/**
 * Returns a translation function bound to the given language. Falls back
 * to English if a key is somehow missing for the selected language.
 */
export function useTranslation(language: Language) {
  return function t(key: DictionaryKey): string {
    const entry = dictionary[key];
    if (!entry) return key;
    return entry[language] ?? entry.english;
  };
}

/** Non-hook variant for use in places that aren't React components. */
export function translate(key: DictionaryKey, language: Language): string {
  const entry = dictionary[key];
  if (!entry) return key;
  return entry[language] ?? entry.english;
}