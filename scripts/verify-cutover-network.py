import re
import shlex
import subprocess

def run(command):
    print("$ " + shlex.join(command), flush=True)
    result = subprocess.run(command, text=True, capture_output=True, check=True, timeout=60)
    print(result.stdout, flush=True)
    return result.stdout

domain = "santacruzreunion.com"
ns = run(["dig", "NS", domain])
answers = set(re.findall(r"^santacruzreunion\.com\.\s+\d+\s+IN\s+NS\s+(\S+)", ns, re.MULTILINE))
assert answers == {"ns1.vercel-dns.com.", "ns2.vercel-dns.com."}, answers
trace = run(["dig", "NS", domain, "+trace", "+time=5", "+tries=1"])
assert "ns1.vercel-dns.com." in trace and "ns2.vercel-dns.com." in trace
dmarc = run(["dig", "TXT", "_dmarc." + domain])
assert '"v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=mailto:dmarc_rua@onsecureserver.net;"' in dmarc

def head(url, expected, location=None):
    output = run(["curl", "-sI", "--show-error", "--max-time", "30", url])
    codes = re.findall(r"^HTTP/\S+ (\d+)", output, re.MULTILINE)
    assert codes and int(codes[-1]) in (expected if isinstance(expected, tuple) else (expected,)), (url, codes)
    if location:
        found = re.search(r"^location:\s*(.+)$", output, re.MULTILINE | re.IGNORECASE)
        assert found and found.group(1).strip() == location, (url, found.group(1) if found else None)

head("https://" + domain + "/", 200)
head("http://" + domain + "/", (301, 302, 307, 308), "https://" + domain + "/")
head("https://www." + domain + "/guides?x=1", 308, "https://" + domain + "/guides?x=1")
head("https://alarconruanoreunion.vercel.app/plan", 308, "https://" + domain + "/plan")
head("https://2026." + domain + "/", 200)
head("https://santa-cruz-reunion-kit.vercel.app/", 404)
guest = subprocess.run(["curl", "--fail", "--silent", "--show-error", "https://2026." + domain + "/"], text=True, capture_output=True, check=True).stdout
assert 'id="schedule-section"' in guest and 'id="lodging-section"' in guest
print("PASS: Vercel-only DNS, exact DMARC, HTTPS certificate verification, redirects, retired project and guest anchors.", flush=True)
