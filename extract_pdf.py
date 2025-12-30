import pdfplumber
import sys

pdf_file = r'd:\CSE_470_Project\quickclean-maid-booking\docs\L6 - Version Control.pptx.pdf'

try:
    with pdfplumber.open(pdf_file) as pdf:
        total_pages = len(pdf.pages)
        print(f"Total pages: {total_pages}", file=sys.stderr)
        
        # Extract pages 28 to end (index 27 to end)
        for i in range(27, total_pages):
            print(f"\n{'='*70}")
            print(f"PAGE {i+1}")
            print('='*70)
            page = pdf.pages[i]
            text = page.extract_text()
            if text:
                print(text)
            else:
                print("[No text extracted]")
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
