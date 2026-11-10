"""Synthesises a soft piano + strings rendition of Pachelbel's Canon in D
(public-domain composition; this rendition is generated from scratch, so it is
free to use). Output: public/music/canon-in-d.mp3"""
import numpy as np, subprocess, os, sys
from scipy.signal import fftconvolve, butter, sosfilt

SR = 44100
CH = 2.0           # seconds per chord
CYC = 8 * CH       # 16 s per progression
N_CYC = 6
TAIL = 4.0
TOTAL = N_CYC * CYC + TAIL
rng = np.random.default_rng(7)
L = np.zeros(int(SR * (TOTAL + 4)))
Rr = np.zeros_like(L)

NOTE = {'C':0,'C#':1,'D':2,'D#':3,'E':4,'F':5,'F#':6,'G':7,'G#':8,'A':9,'A#':10,'B':11}
def hz(n):
    name, octv = n[:-1], int(n[-1])
    m = 12 * (octv + 1) + NOTE[name]
    return 440 * 2 ** ((m - 69) / 12)

def add(sig, t, pan=0.0):
    i = int(t * SR); j = min(i + len(sig), len(L))
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    L[i:j] += sig[: j - i] * l; Rr[i:j] += sig[: j - i] * r

def piano(n, dur, vel=0.5):
    f0 = hz(n); ring = dur + 1.6
    t = np.arange(int(SR * ring)) / SR
    s = np.zeros_like(t)
    B = 0.00025
    for k in range(1, 10):
        fk = k * f0 * np.sqrt(1 + B * k * k)
        if fk > 16000: break
        amp = (1 / k ** 1.6) * (1.0 if k > 1 else 1.2)
        tau = 2.4 / (1 + 0.45 * k) * (220 / max(f0, 110)) ** 0.35
        s += amp * np.sin(2 * np.pi * fk * t + rng.random() * 0.3) * np.exp(-t / tau)
    att = np.minimum(1, t / 0.004)
    rel = np.clip((ring - t) / 0.5, 0, 1)
    s *= att * rel
    # soft hammer
    hn = rng.standard_normal(int(SR * 0.012)) * np.linspace(1, 0, int(SR * 0.012)) * 0.02
    s[: len(hn)] += hn
    return s * vel

def pad(notes, dur, vel=0.06):
    t = np.arange(int(SR * (dur + 1.2))) / SR
    s = np.zeros_like(t)
    for n in notes:
        f0 = hz(n)
        for d in (-0.12, 0.0, 0.13):
            ph = rng.random() * 6.28
            # band-limited saw (few harmonics) = warm string
            for k in range(1, 7):
                s += np.sin(2 * np.pi * k * f0 * (1 + d / 100) * t + ph * k) / k
    env = np.minimum(1, t / 0.9) * np.clip((dur + 1.2 - t) / 1.1, 0, 1)
    sos = butter(2, 1800, 'low', fs=SR, output='sos')
    return sosfilt(sos, s * env) * vel / len(notes)

CHORDS = [('D', ['D3','F#3','A3'], 'D2'), ('A', ['C#3','E3','A3'], 'A1'), ('Bm', ['D3','F#3','B3'], 'B1'), ('F#m', ['C#3','F#3','A3'], 'F#1'),
          ('G', ['D3','G3','B3'], 'G1'), ('D', ['D3','F#3','A3'], 'D2'), ('G', ['D3','G3','B3'], 'G1'), ('A', ['C#3','E3','A3'], 'A1')]
ARP = {'D': ['D3','A3','D4','F#4','A4','F#4','D4','A3'], 'A': ['A2','E3','A3','C#4','E4','C#4','A3','E3'],
       'Bm': ['B2','F#3','B3','D4','F#4','D4','B3','F#3'], 'F#m': ['F#2','C#3','F#3','A3','C#4','A3','F#3','C#3'],
       'G': ['G2','D3','G3','B3','D4','B3','G3','D3']}
V1 = ['F#5','E5','D5','C#5','B4','A4','B4','C#5']
V2 = ['D5','C#5','B4','A4','G4','F#4','G4','E4']
V3 = [('D5','F#5'),('A5','G5'),('F#5','D5'),('F#5','E5'),('D5','B4'),('D5','A4'),('G4','B4'),('A4','G4')]

for c in range(N_CYC):
    for i, (name, triad, bass) in enumerate(CHORDS):
        t0 = c * CYC + i * CH
        add(piano(bass.replace('1', '2'), CH, 0.34), t0, -0.15)
        if c >= 1: add(pad(triad, CH, 0.05 if c < 5 else 0.035), t0, 0.1)
        arp = ARP[name]
        vol = 0.13 if c == 0 else 0.1
        for k, n in enumerate(arp):
            add(piano(n, 0.25, vol * (1.1 if k == 0 else 0.9)), t0 + k * 0.25, -0.3 + 0.6 * (k / 7))
        if c in (1, 2, 5):
            add(piano(V1[i], CH, 0.22), t0, 0.2)
        if c == 2:
            add(piano(V2[i], CH, 0.16), t0 + 0.02, -0.2)
        if c in (3, 4):
            a, b = V3[i]
            add(piano(a, 1.0, 0.2), t0, 0.15); add(piano(b, 1.0, 0.18), t0 + 1.0, 0.15)
            if c == 4: add(piano(V1[i].replace('5', '4'), CH, 0.1), t0, -0.25)
# closing chord
tend = N_CYC * CYC
for n, v in (('D2', 0.3), ('A3', 0.12), ('D4', 0.12), ('F#4', 0.12), ('D5', 0.16)):
    add(piano(n, TAIL - 1.0, v), tend, 0)

# reverb
ir_len = int(SR * 2.8)
tt = np.arange(ir_len) / SR
sos = butter(1, 5000, 'low', fs=SR, output='sos')
irL = sosfilt(sos, rng.standard_normal(ir_len)) * np.exp(-tt / 0.75)
irR = sosfilt(sos, rng.standard_normal(ir_len)) * np.exp(-tt / 0.75)
irL /= np.sqrt(np.sum(irL ** 2)); irR /= np.sqrt(np.sum(irR ** 2))
wetL = fftconvolve(L, irL)[: len(L)]; wetR = fftconvolve(Rr, irR)[: len(Rr)]
outL = L * 0.8 + wetL * 0.35; outR = Rr * 0.8 + wetR * 0.35

# fold the tail into the start so the loop is seamless
n = int(SR * TOTAL)
fold = len(outL) - n
outL[:fold] += outL[n:n + fold]; outR[:fold] += outR[n:n + fold]
outL = outL[:n]; outR = outR[:n]
st = np.stack([outL, outR], 1)
st /= np.max(np.abs(st)) / 0.6
pcm = (st * 32767).astype('<i2').tobytes()
out = os.path.join(os.path.dirname(__file__), '..', 'src', 'assets')
os.makedirs(out, exist_ok=True)
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 's16le', '-ar', str(SR), '-ac', '2', '-i', '-', '-b:a', '96k',
                os.path.join(out, 'canon-in-d.mp3')], input=pcm, check=True)
print('ok', TOTAL, 's')
