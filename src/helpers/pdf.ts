import html2canvas from "html2canvas"
import 'pdfmake'

declare const pdfMake: any

export const saveAsPdf = async (el: HTMLElement, fileName: string) => {
  const canvas = await html2canvas(el, {
    
  })
  const data = canvas.toDataURL()
  const docDefinition = {
    content: [{
      image: data,
      width: 500,
    }]
  }
  return new Promise((res) => {
    pdfMake.createPdf(docDefinition).download(fileName, res)
  })
}

