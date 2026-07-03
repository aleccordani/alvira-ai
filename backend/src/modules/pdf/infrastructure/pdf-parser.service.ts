import PDFParser from "pdf2json";

export class PdfParserService {
  extractText(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const pdfParser = new PDFParser();

      pdfParser.on("pdfParser_dataError", (error: any) => {
        reject(error.parserError ?? error);
      });

      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        const text = pdfData.Pages.flatMap((page) =>
          page.Texts.map((textItem) =>
            decodeURIComponent(textItem.R.map((r) => r.T).join(" ")),
          ),
        ).join(" ");

        resolve(text.trim());
      });

      pdfParser.loadPDF(filePath);
    });
  }
}
