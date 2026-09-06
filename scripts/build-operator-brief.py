from pathlib import Path
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Image, Table, TableStyle, KeepTogether
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase.pdfmetrics import stringWidth

ROOT=Path(__file__).resolve().parents[1]
import tempfile
REVIEW=Path(tempfile.gettempdir())/'reunion-acquisition-pdf'
REVIEW.mkdir(exist_ok=True)
OUT=ROOT/'public/operator-brief.pdf'
ink=colors.HexColor('#183f36'); muted=colors.HexColor('#52655c'); paper=colors.HexColor('#f8f6ef'); line=colors.HexColor('#d8ddd0'); sage=colors.HexColor('#edf0e7')
W,H=612,792; LM=48; CW=W-96
styles={
 'eyebrow':ParagraphStyle('eyebrow',fontName='Helvetica-Bold',fontSize=8,leading=12,textColor=muted,spaceAfter=14),
 'hero':ParagraphStyle('hero',fontName='Times-Roman',fontSize=39,leading=41,textColor=ink,spaceAfter=18),
 'title':ParagraphStyle('title',fontName='Times-Roman',fontSize=30,leading=33,textColor=ink,spaceAfter=19),
 'section':ParagraphStyle('section',fontName='Times-Roman',fontSize=20,leading=23,textColor=ink,spaceBefore=16,spaceAfter=10),
 'body':ParagraphStyle('body',fontName='Helvetica',fontSize=10,leading=15,textColor=muted,spaceAfter=9),
 'lead':ParagraphStyle('lead',fontName='Helvetica',fontSize=11,leading=17,textColor=muted,spaceAfter=16),
 'small':ParagraphStyle('small',fontName='Helvetica',fontSize=8,leading=12,textColor=muted,spaceAfter=8),
 'table':ParagraphStyle('table',fontName='Helvetica',fontSize=9,leading=13,textColor=muted),
 'tablehead':ParagraphStyle('tablehead',fontName='Helvetica-Bold',fontSize=9,leading=13,textColor=ink),
 'link':ParagraphStyle('link',fontName='Helvetica-Bold',fontSize=10,leading=15,textColor=ink,spaceAfter=9),
}
def p(t,s='body'):return Paragraph(t,styles[s])
def link(text,url):return p(f'<link href="{url}" color="#214f43">{text}</link>','link')
def bullets(items):
 return [p(f'&#8226;  {t}') for t in items]
def table(rows, widths):
 t=Table([[p(c,'tablehead' if i==0 else 'table') for c in row] for i,row in enumerate(rows)],colWidths=widths,hAlign='LEFT')
 t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),11),('RIGHTPADDING',(0,0),(-1,-1),11),('TOPPADDING',(0,0),(-1,-1),10),('BOTTOMPADDING',(0,0),(-1,-1),10),('BACKGROUND',(0,0),(-1,0),sage),('LINEBELOW',(0,0),(-1,-1),.45,line)]))
 return t

def page(canvas,doc):
 canvas.saveState();canvas.setFillColor(paper);canvas.rect(0,0,W,H,fill=1,stroke=0)
 canvas.setStrokeColor(line);canvas.line(LM,53,W-LM,53)
 canvas.setFont('Helvetica',7.4);canvas.setFillColor(muted);canvas.drawString(LM,38,'SANTA CRUZ REUNION KIT  /  OPERATOR BRIEF')
 canvas.drawRightString(W-LM,38,f'SEPTEMBER 2026  /  {doc.page}')
 canvas.restoreState()

doc=SimpleDocTemplate(str(OUT),pagesize=(W,H),leftMargin=LM,rightMargin=LM,topMargin=44,bottomMargin=70,title='Santa Cruz Reunion Kit - Operator Acquisition Brief',author='Jason La Barbera',subject='$2,500 proposed business-asset acquisition')
story=[]
story += [p('AVAILABLE FOR ACQUISITION  /  SANTA CRUZ, CA','eyebrow'),p('Your next local business.<br/>The groundwork is built.','hero'),p('A working reunion-planning product, editable Santa Cruz research, and a practical operator playbook. Bring your local relationships and your audience. Make the product yours.','lead')]
# A cropped coastal image keeps the prospectus tied to the real destination.
from PIL import Image as PILImage
im=PILImage.open(ROOT/'public/images/santa-cruz-coast.jpg'); tw,th=1100,360
ratio=tw/th; target_h=int(im.width/ratio); top=max(0,int(im.height*.25)); top=min(top,im.height-target_h)
im.crop((0,top,im.width,top+target_h)).save(REVIEW/'coast-brief.jpg',quality=92)
story += [Image(str(REVIEW/'coast-brief.jpg'),width=CW,height=CW*th/tw),Spacer(1,6),p('Coastal photograph: <link href="https://unsplash.com/photos/qR5wQNyDA1s" color="#214f43">Sean Kelley / Unsplash</link>.','small'),Spacer(1,7),p('<b>$2,500</b> one-time asking price for the business assets.','lead'),table([['The product','The owner','The stage'],['Live organizer flow, sourced local research, provider inquiries and guest materials.','A local planner, concierge, hospitality operator, or destination publisher.','Working public preview. Demand, revenue and conversion are unvalidated.']],[CW/3]*3),Spacer(1,16),link('Inspect the researched 100-person weekend','https://santacruzreunion.com/blueprint'),link('Explore the live product and acquisition scope','https://santacruzreunion.com/for-sale'),p('This is a proposed asset acquisition, separate from the consumer planning kit. Final assets, rights and handover terms must be agreed in writing.','small'),PageBreak()]

story += [p('01  /  WHAT YOU ARE BUYING','eyebrow'),p('Open the product.<br/>Inspect the substance.','title'),p('The value is a working foundation that an operator can adapt and put in front of the right families. It is not a represented customer base or income stream.','lead'),table([['Proposed asset','What to inspect'],['Planning application','Guided brief, provider shortlist, editable inquiries, quote comparison, schedule and organizer exports.'],['Local research and original guides','Editable provider records, official-source links, check dates, published price context and planning questions.'],['Guest delivery','A designed guest guide, shareable snapshot, calendar download and invitation text. Private budgets and negotiations stay out of guest materials.'],['Source and handover','Seller-owned source snapshot, asset inventory, setup instructions, acceptance checklist and first-month operating plan.']],[155,CW-155]),p('The local detail is the point.','section'),p('The 100-person picnic blueprint combines a published $327 nonresident picnic-site fee and $1,595 for 100 bag lunches: a <b>$1,922 base subtotal</b>. It shows the source links, adjustable headcount, weekend schedule, and booking order. Taxes, other fees, permits, staffing, transport, lodging, and other meals are additional or unpriced. Availability and complete terms require confirmation.'),p('The origin is real. The boundaries are clear.','section'),p('Jason La Barbera helped organize a June 5-7, 2026 reunion for around 100 relatives. This product was developed afterward. The founder story is firsthand experience, not a paying-customer result. The original family domain, historical guest website, and private family information are excluded. Any continued use of the family case study requires agreement.'),PageBreak()]

story += [p('02  /  THE FIRST MONTH','eyebrow'),p('Start with real organizers.<br/>Earn your next decision.','title')]
for title,body in [
('Days 1-3: take control.','Deploy under your GitHub and hosting accounts. Set the correct domain and monitored inbox. Complete the acceptance checks. Choose one customer segment you can already reach.'),
('Days 4-7: verify the decisions.','Recheck the providers most relevant to your customers. Prioritize capacity by layout, price context, minimums, accessible routes, parking, weather alternatives, deposits and cancellations. Record facts with a source and date; identify questions that still need a provider reply.'),
('Days 8-14: watch five organizers.','Observe each person choosing a plausible gathering place, preparing an inquiry and sharing guest information. Ask what helped their next real decision and where they needed assistance. Five observations guide a pilot; they do not establish a market conversion rate.'),
('Days 15-21: test one bounded offer.','Choose a self-service product or an assisted service. Define the exact deliverable, support scope, price and delivery. Test payment, receipt, access and refund handling before charging. A historical $39 kit price is an unvalidated hypothesis.'),
('Days 22-30: measure actual delivery.','Use one relevant audience or referral channel. Track qualified conversations, useful plans, actual purchases, delivery labor, support and refunds. Improve the research using real provider replies. A download is not a sale.')]:
 story += [KeepTogether([p(title,'section'),p(body)])]
story += [p('Three plausible operating models','section'),p('<b>Local planner:</b> a paid planning session or tailored shortlist.<br/><b>Hospitality operator:</b> planning help for existing group inquiries.<br/><b>Destination publisher:</b> a useful product for an existing local audience.'),p('These are offers to validate, not existing revenue streams or earnings promises.','small'),PageBreak()]

story += [p('03  /  DUE DILIGENCE & NEXT STEPS','eyebrow'),p('A clear transfer.<br/>An honest starting point.','title'),p('Before payment, agree the exact source and content inventory, transferred rights, exclusions, payment schedule, deployment scope, acceptance checks and any transition assistance.','lead'),table([['Confirm before closing','Operator responsibility'],['Clean source transfer','Exclude private history, secrets, personal accounts, private guest data and non-transferable media. Third-party licenses retain their terms.'],['Independent deployment','Run the reviewed release in buyer-controlled GitHub and Vercel accounts. Verify contact details, domain, planner, downloads and guest sharing.'],['Current product scope','Local organizer storage and guest snapshots. No central guest database, automatic RSVP collection, consumer billing, automatic quotes or provider booking.'],['Ongoing operations','Research freshness, customer acquisition, support, maintenance and any new payment or email integrations.']],[155,CW-155]),p('The purchase price is not the operating budget.','section'),p('Hosting, domain and renewal, payment fees, support and delivery costs are separate. Review current <link href="https://vercel.com/pricing" color="#214f43">Vercel</link> and <link href="https://github.com/pricing" color="#214f43">GitHub</link> plans for your intended use. The current deterministic planner does not require a paid LLM API.'),p('Example arithmetic - not an earnings projection.','section'),p('At an assumed $39 price, 65 sales would produce $2,535 gross receipts. At an assumed $399 assisted-service price, 7 engagements would produce $2,793 gross receipts. Demand at either price is unvalidated. Neither example includes marketing, processing, refunds, delivery labor, hosting, support or tax. Neither is profit or a payback promise.','small'),p('Start with the asset inventory and a conversation.','section'),link('Email Jason: jason@t3.am','mailto:jason@t3.am?subject=Santa%20Cruz%20Reunion%20Kit%20acquisition%20inquiry'),p('Tell Jason who you already serve, how you would use the product, and what you need to inspect before reviewing transfer terms. No deposit or payment is collected on the acquisition page.','small')]
doc.build(story,onFirstPage=page,onLaterPages=page)
print(OUT)
