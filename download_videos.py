#!/usr/bin/env python3
"""
Script to solve eyny.com PoW challenge and download videos.
"""
import hashlib
import re
import json
import time
import requests
from urllib.parse import urljoin, quote

BASE_URL = "https://www53.eyny.com"
SESSION = requests.Session()
SESSION.headers.update({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
})

def solve_pow(challenge, ts, diff=4):
    """Solve the PoW challenge by finding a nonce that produces a SHA-256 hash starting with diff zeros."""
    target_prefix = "0" * diff
    nonce = 0
    while True:
        text = f"{challenge}|{ts}|{nonce}"
        hash_hex = hashlib.sha256(text.encode()).hexdigest()
        if hash_hex.startswith(target_prefix):
            return nonce, hash_hex
        nonce += 1

def get_pow_params(html):
    """Extract PoW parameters from HTML."""
    challenge_match = re.search(r'var\s+challenge\s*=\s*"([^"]+)"', html)
    ts_match = re.search(r'var\s+ts\s*=\s*"([^"]+)"', html)
    diff_match = re.search(r'var\s+diff\s*=\s*(\d+)', html)
    
    if challenge_match and ts_match:
        return {
            "challenge": challenge_match.group(1),
            "ts": ts_match.group(1),
            "diff": int(diff_match.group(1)) if diff_match else 4
        }
    return None

def bypass_pow(url):
    """Access a URL, solve PoW if needed, and return the final page HTML."""
    print(f"[*] Accessing: {url}")
    resp = SESSION.get(url)
    html = resp.text
    
    # Check if PoW is needed
    if "瀏覽器安全檢查中" in html or "verify your browser" in html:
        print("[*] PoW challenge detected, solving...")
        params = get_pow_params(html)
        if params:
            print(f"    Challenge: {params['challenge']}, TS: {params['ts']}, Diff: {params['diff']}")
            nonce, hash_hex = solve_pow(params['challenge'], params['ts'], params['diff'])
            print(f"    Solved! Nonce: {nonce}, Hash: {hash_hex}")
            
            # Set cookies
            SESSION.cookies.set("56a9acc_n", str(nonce), domain=".eyny.com", path="/")
            SESSION.cookies.set("56a9acc_ts", params['ts'], domain=".eyny.com", path="/")
            SESSION.cookies.set("56a9acc_ch", params['challenge'], domain=".eyny.com", path="/")
            
            # Re-access the URL with cookies
            time.sleep(0.5)
            resp = SESSION.get(url)
            html = resp.text
            
            # Check if still PoW
            if "瀏覽器安全檢查中" in html:
                print("[*] PoW still present, solving again...")
                params = get_pow_params(html)
                if params:
                    nonce, hash_hex = solve_pow(params['challenge'], params['ts'], params['diff'])
                    print(f"    Solved! Nonce: {nonce}, Hash: {hash_hex}")
                    SESSION.cookies.set("56a9acc_n", str(nonce), domain=".eyny.com", path="/")
                    SESSION.cookies.set("56a9acc_ts", params['ts'], domain=".eyny.com", path="/")
                    SESSION.cookies.set("56a9acc_ch", params['challenge'], domain=".eyny.com", path="/")
                    time.sleep(0.5)
                    resp = SESSION.get(url)
                    html = resp.text
    
    return html

def search_videos(keyword):
    """Search for videos on eyny.com."""
    search_url = f"{BASE_URL}/en/search?kw={quote(keyword)}"
    html = bypass_pow(search_url)
    return html

def extract_video_links(html):
    """Extract video links from search results page."""
    links = []
    # Match patterns like /en/watch?v=... or /watch?v=...
    pattern = r'href="(/en/watch\?v=[^"]+)"'
    matches = re.findall(pattern, html)
    for match in matches:
        full_url = urljoin(BASE_URL, match)
        if full_url not in links:
            links.append(full_url)
    return links

def extract_video_title(html):
    """Extract video title from page."""
    title_match = re.search(r'<title>([^<]+)</title>', html)
    if title_match:
        title = title_match.group(1).strip()
        # Clean up title
        title = title.replace(" - 伊莉影片區", "").strip()
        return title
    return "Unknown"

def extract_video_url(html):
    """Extract video source URL from page HTML."""
    # Look for video source in various patterns
    patterns = [
        r'<source[^>]+src="([^"]+\.mp4[^"]*)"',
        r'<video[^>]*>.*?<source[^>]+src="([^"]+)"',
        r'src:\s*"([^"]+\.mp4[^"]*)"',
        r'"video_url"\s*:\s*"([^"]+)"',
        r'(https?://[a-z0-9]+\.static-file\.com/[^"]+\.mp4[^"]*)',
        r'(https?://[^"]+\.mp4[^"]*token[^"]*)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, html, re.DOTALL)
        if match:
            return match.group(1)
    
    # Try to find in JavaScript blocks
    js_pattern = r'(https?://[^\s"\'<>]+\.mp4[^\s"\'<>]*)'
    matches = re.findall(js_pattern, html)
    if matches:
        return matches[0]
    
    return None

def download_video(url, filename):
    """Download a video from URL."""
    print(f"[*] Downloading: {filename}")
    print(f"    URL: {url[:100]}...")
    
    SESSION.headers.update({
        "Referer": BASE_URL + "/",
    })
    
    resp = SESSION.get(url, stream=True)
    total_size = int(resp.headers.get('content-length', 0))
    downloaded = 0
    
    filepath = f"/home/z/my-project/download/{filename}"
    
    with open(filepath, 'wb') as f:
        for chunk in resp.iter_content(chunk_size=8192):
            if chunk:
                f.write(chunk)
                downloaded += len(chunk)
                if total_size > 0:
                    pct = (downloaded / total_size) * 100
                    print(f"\r    Progress: {pct:.1f}% ({downloaded}/{total_size})", end="", flush=True)
    
    print(f"\n    ✓ Saved: {filepath}")
    return filepath

def main():
    # Videos to search for
    searches = [
        {"keyword": "3dimmanimations Takagi", "name": "Takagi_and_Chii"},
        {"keyword": "3dimmanimations bunny bars", "name": "Bunny_Bars"},
        {"keyword": "3dimmanimations hook", "name": "Hook"},
    ]
    
    results = []
    
    for search in searches:
        print(f"\n{'='*60}")
        print(f"[*] Searching for: {search['keyword']}")
        print(f"{'='*60}")
        
        html = search_videos(search['keyword'])
        
        # Check if we got search results or PoW page
        if "瀏覽器安全檢查中" in html:
            print("[!] Still stuck on PoW, trying alternative approach...")
            continue
        
        # Extract video links
        video_links = extract_video_links(html)
        print(f"[*] Found {len(video_links)} video links")
        
        if video_links:
            # Take the first relevant result
            for link in video_links[:3]:
                print(f"[*] Accessing video page: {link[:80]}...")
                video_html = bypass_pow(link)
                
                if "瀏覽器安全檢查中" in video_html:
                    print("[!] PoW still present, skipping...")
                    continue
                
                title = extract_video_title(video_html)
                video_url = extract_video_url(video_html)
                
                print(f"    Title: {title}")
                print(f"    Video URL: {video_url[:80] if video_url else 'NOT FOUND'}...")
                
                if video_url:
                    # Sanitize filename
                    safe_name = search['name']
                    filename = f"{safe_name}.mp4"
                    filepath = download_video(video_url, filename)
                    results.append({
                        "title": title,
                        "name": safe_name,
                        "filepath": filepath,
                        "video_url": video_url,
                        "page_url": link,
                    })
                    break
                else:
                    print("[!] Could not extract video URL from page")
                    # Save HTML for debugging
                    debug_path = f"/home/z/my-project/download/debug_{search['name']}.html"
                    with open(debug_path, 'w') as f:
                        f.write(video_html)
                    print(f"    Saved debug HTML to: {debug_path}")
        else:
            print("[!] No video links found in search results")
            # Save search results for debugging
            debug_path = f"/home/z/my-project/download/debug_search_{search['name']}.html"
            with open(debug_path, 'w') as f:
                f.write(html)
            print(f"    Saved search HTML to: {debug_path}")
    
    # Save results
    print(f"\n{'='*60}")
    print(f"[*] Results Summary")
    print(f"{'='*60}")
    for r in results:
        print(f"  ✓ {r['name']}: {r['title']}")
        print(f"    File: {r['filepath']}")
    
    # Save results as JSON
    with open("/home/z/my-project/download/video_results.json", "w") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"\n[*] Results saved to /home/z/my-project/download/video_results.json")
    return results

if __name__ == "__main__":
    main()
