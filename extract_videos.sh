#!/bin/bash

# Function to solve PoW and extract video URL from eyny.com
extract_video() {
    local url=$1
    local output_file=$2
    
    echo "Opening: $url"
    agent-browser open "$url" --timeout 30000
    
    # Wait for PoW page
    agent-browser wait 2000
    
    # Extract challenge, ts from the PoW script
    RESULT=$(agent-browser eval "
    (async function() {
        var html = document.documentElement.outerHTML;
        if (html.indexOf('solvePoW') > -1) {
            var challengeMatch = html.match(/challenge\\s*=\\s*\"([^\"]+)\"/);
            var tsMatch = html.match(/ts\\s*=\\s*\"([^\"]+)\"/);
            var diffMatch = html.match(/diff\\s*=\\s*(\\d+)/);
            if (challengeMatch && tsMatch) {
                return JSON.stringify({needPow: true, challenge: challengeMatch[1], ts: tsMatch[1], diff: diffMatch ? parseInt(diffMatch[1]) : 4});
            }
        }
        // Check if video is already loaded
        var v = document.querySelector('video');
        if (v && v.src) {
            return JSON.stringify({needPow: false, videoUrl: v.src});
        }
        // Check resolution object
        if (typeof resolution !== 'undefined' && Object.keys(resolution).length > 0) {
            var urls = [];
            for (var key in resolution) {
                urls.push(resolution[key].url);
            }
            return JSON.stringify({needPow: false, videoUrls: urls});
        }
        return JSON.stringify({needPow: false, videoUrl: '', resolution: typeof resolution !== 'undefined' ? JSON.stringify(resolution) : 'undefined'});
    })()
    " 2>/dev/null | tr -d '"')
    
    echo "Result: $RESULT"
    
    # Parse the result
    NEED_POW=$(echo "$RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('needPow', False))" 2>/dev/null)
    
    if [ "$NEED_POW" = "True" ]; then
        CHALLENGE=$(echo "$RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['challenge'])" 2>/dev/null)
        TS=$(echo "$RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['ts'])" 2>/dev/null)
        DIFF=$(echo "$RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('diff',4))" 2>/dev/null)
        
        echo "Solving PoW: challenge=$CHALLENGE ts=$TS diff=$DIFF"
        
        # Solve PoW via JS eval
        agent-browser eval "
        (async function() {
            function buf2hex(buffer) {
                return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
            }
            var challenge = '$CHALLENGE';
            var ts = '$TS';
            var diff = $DIFF;
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
        " 2>/dev/null
        
        # Reload
        agent-browser eval "location.replace(location.href)" 2>/dev/null
        agent-browser wait 5000
        
        # Now extract video URL
        VIDEO_URL=$(agent-browser eval "
        (function() {
            var v = document.querySelector('video');
            if (v && v.src) return v.src;
            if (typeof resolution !== 'undefined') {
                for (var key in resolution) {
                    return resolution[key].url;
                }
            }
            return '';
        })()
        " 2>/dev/null | tr -d '"')
        
        echo "$output_file: $VIDEO_URL"
        echo "$VIDEO_URL" > "$output_file"
    else
        VIDEO_URL=$(echo "$RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('videoUrl', ''))" 2>/dev/null)
        echo "$output_file: $VIDEO_URL"
        echo "$VIDEO_URL" > "$output_file"
    fi
    
    agent-browser close 2>/dev/null
}

# Extract each video
extract_video "https://www12.eyny.com/watch?v=uCBMvJ5JikI" "/home/z/my-project/url_takagi_san.txt"
extract_video "https://www03.eyny.com/BW/watch?v=CNCICerduf_" "/home/z/my-project/url_bunny_bar_klee.txt"
extract_video "https://www21.eyny.com/watch?v=RI0I41gV7lA" "/home/z/my-project/url_bunny_bar_diona.txt"
extract_video "https://www14.eyny.com/re/watch?v=fJa-rwN7zyt" "/home/z/my-project/url_bunny_bar3.txt"
extract_video "https://www21.eyny.com/watch?v=ZDV0xfIEMFz" "/home/z/my-project/url_bunny_bar3_music.txt"

