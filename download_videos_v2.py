#!/usr/bin/env python3
"""
Script to solve eyny.com PoW challenge and download videos using browser automation.
Uses agent-browser for cookie/PoW management and video extraction.
"""
import subprocess
import json
import time
import re
import os

def run_browser(cmd, timeout=120000):
    """Run an agent-browser command and return output."""
    result = subprocess.run(
        f"agent-browser {cmd}",
        shell=True, capture_output=True, text=True, timeout=timeout//1000
    )
    return result.stdout.strip()

def solve_pow_in_browser():
    """Solve the PoW challenge in the current browser page."""
    js_code = """
(async function() {
    function buf2hex(buffer) {
        return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
    }
    var html = document.documentElement.outerHTML;
    var chMatch = html.match(/var\\s+challenge\\s*=\\s*"([^"]+)"/);
    var tsMatch = html.match(/var\\s+ts\\s*=\\s*"([^"]+)"/);
    var diffMatch = html.match(/var\\s+diff\\s*=\\s*(\\d+)/);
    if (!chMatch) return 'No PoW found';
    var challenge = chMatch[1], ts = tsMatch[1], diff = parseInt(diffMatch[1]);
    var targetPrefix = '0'.repeat(diff);
    var nonce = 0;
    var encoder = new TextEncoder();
    while (true) {
        var text = challenge + '|' + ts + '|' + nonce;
        var data = encoder.encode(text);
        var hashBuffer = await crypto.subtle.digest('SHA-256', data);
        var hashHex = buf2hex(hashBuffer);
        if (hashHex.startsWith(targetPrefix)) {
            var now = new Date();
            now.setTime(now.getTime() + 86400000);
            var g = '; expires=' + now.toGMTString() + '; path=/' + '; domain=.eyny.com' + '; SameSite=Lax';
            document.cookie = '56a9acc_n=' + nonce + g;
            document.cookie = '56a9acc_ts=' + ts + g;
            document.cookie = '56a9acc_ch=' + challenge + g;
            return 'Solved! Nonce: ' + nonce;
        }
        nonce++;
    }
})()
"""
    result = run_browser(f'eval "{js_code.replace(chr(34), chr(92)+chr(34)).replace(chr(10), " ")}"')
    return result

def open_page_with_pow(url):
    """Open a URL, solve PoW if needed, and wait for page to load."""
    print(f"  [*] Opening: {url[:80]}...")
    run_browser(f'open "{url}" --timeout 30000')
    time.sleep(3)
    
    # Check if PoW is needed
    title = run_browser('get title')
    if not title or "瀏覽器安全檢查" in title:
        print("  [*] PoW detected, solving...")
        result = solve_pow_in_browser()
        print(f"  [*] {result}")
        run_browser('eval "location.replace(location.href)"')
        time.sleep(5)
        
        # Verify page loaded
        title = run_browser('get title')
        print(f"  [*] Page title: {title}")
    
    return title

def extract_video_src():
    """Extract video source URL from current page."""
    js = "document.querySelector('video') ? document.querySelector('video').src : 'no video element'"
    result = run_browser(f'eval "{js}"')
    return result

def download_video_file(url, filepath, referer="https://www53.eyny.com/"):
    """Download a video using curl."""
    print(f"  [*] Downloading to: {filepath}")
    cmd = [
        'curl', '-L', '-o', filepath,
        '-H', f'Referer: {referer}',
        '-H', 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        url
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
    if os.path.exists(filepath) and os.path.getsize(filepath) > 1000:
        size_mb = os.path.getsize(filepath) / (1024*1024)
        print(f"  ✓ Downloaded: {filepath} ({size_mb:.1f} MB)")
        return True
    else:
        print(f"  ✗ Download failed or file too small")
        return False

def main():
    # Define videos to download with known URLs
    videos = [
        {
            "name": "3DimmAnimations_Takagi_and_Chii_2K",
            "url": "https://www61.eyny.com/en/watch?v=KuL5qfmvRq3",
            "title": "3DimmAnimations Takagi & Chii 2K",
        },
        {
            "name": "3DimmAnimations_Bunny_Bar_3_Music_Ver",
            "url": "https://www21.eyny.com/watch?v=ZDV0xfIEMFz",
            "title": "3DimmAnimations 原神Bunny Bar 3 Music Ver.",
        },
        {
            "name": "3DimmAnimations_Hook",
            "url": "https://www17.eyny.com/Se/watch?v=s02YK50gCkT",
            "title": "[3D][蘿莉]崩壞星穹鐵道- 虎克[3dimmanimations]",
        },
    ]
    
    # Check which videos already exist
    download_dir = "/home/z/my-project/download"
    os.makedirs(download_dir, exist_ok=True)
    
    results = []
    
    for video in videos:
        print(f"\n{'='*60}")
        print(f"[*] Processing: {video['title']}")
        print(f"{'='*60}")
        
        filepath = os.path.join(download_dir, f"{video['name']}.mp4")
        
        # Skip if already downloaded
        if os.path.exists(filepath) and os.path.getsize(filepath) > 100000:
            size_mb = os.path.getsize(filepath) / (1024*1024)
            print(f"  ✓ Already downloaded: {filepath} ({size_mb:.1f} MB)")
            results.append({
                "name": video['name'],
                "title": video['title'],
                "filepath": filepath,
                "page_url": video['url'],
            })
            continue
        
        # Open the video page and solve PoW
        title = open_page_with_pow(video['url'])
        
        if not title:
            print("  [!] Failed to load page")
            continue
        
        # Extract video source
        video_src = extract_video_src()
        print(f"  [*] Video src: {video_src[:80] if video_src else 'NOT FOUND'}...")
        
        if video_src and video_src != 'no video element' and video_src.startswith('http'):
            # Download the video
            success = download_video_file(video_src, filepath)
            if success:
                results.append({
                    "name": video['name'],
                    "title": video['title'],
                    "filepath": filepath,
                    "video_src": video_src,
                    "page_url": video['url'],
                })
        else:
            print("  [!] Could not extract video source, trying to click play...")
            # Try clicking play button
            try:
                run_browser('snapshot -i')
                # Try to find and click play button
                run_browser('click @e14', timeout=10000)
                time.sleep(3)
                video_src = extract_video_src()
                if video_src and video_src != 'no video element' and video_src.startswith('http'):
                    success = download_video_file(video_src, filepath)
                    if success:
                        results.append({
                            "name": video['name'],
                            "title": video['title'],
                            "filepath": filepath,
                            "video_src": video_src,
                            "page_url": video['url'],
                        })
            except Exception as e:
                print(f"  [!] Error: {e}")
    
    # Save results
    print(f"\n{'='*60}")
    print(f"[*] Results Summary")
    print(f"{'='*60}")
    for r in results:
        print(f"  ✓ {r['name']}: {r['title']}")
        print(f"    File: {r['filepath']}")
    
    with open(os.path.join(download_dir, "video_results.json"), "w") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    return results

if __name__ == "__main__":
    main()
