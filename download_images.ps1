$base = "c:\Code-journy\jewellery\public\images\products"

# Ensure directory exists
New-Item -ItemType Directory -Path $base -Force | Out-Null

$images = @{
    # RINGS (15 unique)
    "ring_1.png"  = "photo-1605100804763-247f67b3557e"  # gold solitaire diamond ring
    "ring_2.png"  = "photo-1602751584552-8ba73aad10e1"  # rose gold ring
    "ring_3.png"  = "photo-1603561591411-07134e71a2a9"  # dark gold ring
    "ring_4.png"  = "photo-1543294001-f7cd5d7fb516"  # engagement ring
    "ring_5.png"  = "photo-1608042314453-ae338d80c427"  # gold band
    "ring_6.png"  = "photo-1611591437281-460bfbe1220a"  # luxury ring on surface
    "ring_7.png"  = "photo-1586104237842-0445f0326760"  # silver diamond ring
    "ring_8.png"  = "photo-1603561596112-0a132b757442"  # wedding ring
    "ring_9.png"  = "photo-1605100804763-247f67b3557e"  # couple rings
    "ring_10.png" = "photo-1591209627802-6c0ddba3d271"  # gold ring black bg
    "ring_11.png" = "photo-1600721391689-2564bb8055de"  # stacking rings
    "ring_12.png" = "photo-1598560917505-59a3ad559071"  # vintage ring
    "ring_13.png" = "photo-1612817159949-195b6eb9e31a"  # emerald ring
    "ring_14.png" = "photo-1609587312208-cea54be969e7"  # pearl ring
    "ring_15.png" = "photo-1599458252573-56ae36120de1"  # minimalist gold ring

    # EARRINGS (15 unique)
    "earrings_1.png"  = "photo-1535632066927-ab7c9ab60908"  # gold hoop earrings
    "earrings_2.png"  = "photo-1588444837495-c6cfeb53f32d"  # diamond drop earrings
    "earrings_3.png"  = "photo-1630019852942-f89202989a59"  # emerald studs
    "earrings_4.png"  = "photo-1617038260897-41a1f14a8ca0"  # pearl earrings
    "earrings_5.png"  = "photo-1611085583191-a3b181a88401"  # gold chandelier
    "earrings_6.png"  = "photo-1589128777073-263566ae5e4d"  # statement earrings
    "earrings_7.png"  = "photo-1599643477877-530eb83abc8e"  # dangle earrings
    "earrings_8.png"  = "photo-1574634534894-89d080c7c36c"  # crystal studs
    "earrings_9.png"  = "photo-1596944924616-7b38e7cfac36"  # silver hoops
    "earrings_10.png" = "photo-1611652022419-a9419f74343d"  # teardrop earrings
    "earrings_11.png" = "photo-1625794084867-8ddd74671414"  # minimalist studs
    "earrings_12.png" = "photo-1583292650898-7d22cd27ca6f"  # baroque earrings
    "earrings_13.png" = "photo-1602153508753-627ea587c7f2"  # floral earrings
    "earrings_14.png" = "photo-1618164435735-413d3b066c9a"  # tassel earrings
    "earrings_15.png" = "photo-1606760227091-3dd870d97f1d"  # clip-on earrings

    # NECKLACES (15 unique)
    "necklace_1.png"  = "photo-1599643478518-a784e5dc4c8f"  # gold chain
    "necklace_2.png"  = "photo-1611652022419-a9419f74343d"  # pearl pendant
    "necklace_3.png"  = "photo-1611591437281-460bfbe1220a"  # heart locket
    "necklace_4.png"  = "photo-1515562141589-67f0d364430f"  # layered chains
    "necklace_5.png"  = "photo-1599459183200-59c7687a0275"  # diamond pendant
    "necklace_6.png"  = "photo-1573408301185-9146fe634ad0"  # choker necklace
    "necklace_7.png"  = "photo-1602153508753-627ea587c7f2"  # vintage necklace
    "necklace_8.png"  = "photo-1611085583191-a3b181a88401"  # collar necklace
    "necklace_9.png"  = "photo-1596944924616-7b38e7cfac36"  # multi-strand
    "necklace_10.png" = "photo-1600721391689-2564bb8055de"  # lariat necklace
    "necklace_11.png" = "photo-1630019852942-f89202989a59"  # opera necklace
    "necklace_12.png" = "photo-1617038260897-41a1f14a8ca0"  # ruby pendant
    "necklace_13.png" = "photo-1609587312208-cea54be969e7"  # station necklace
    "necklace_14.png" = "photo-1605100804763-247f67b3557e"  # Y-necklace
    "necklace_15.png" = "photo-1598560917505-59a3ad559071"  # bead necklace

    # BRACELETS (15 unique)
    "bracelet_1.png"  = "photo-1573408301185-9146fe634ad0"  # gold link
    "bracelet_2.png"  = "photo-1611085583191-a3b181a88401"  # diamond cuff
    "bracelet_3.png"  = "photo-1602751584552-8ba73aad10e1"  # rose gold bangle
    "bracelet_4.png"  = "photo-1543294001-f7cd5d7fb516"  # charm bracelet
    "bracelet_5.png"  = "photo-1596944924616-7b38e7cfac36"  # tennis bracelet
    "bracelet_6.png"  = "photo-1600721391689-2564bb8055de"  # stack bangles
    "bracelet_7.png"  = "photo-1588444837495-c6cfeb53f32d"  # cuff bracelet
    "bracelet_8.png"  = "photo-1599643478518-a784e5dc4c8f"  # chain bracelet
    "bracelet_9.png"  = "photo-1603561591411-07134e71a2a9"  # wrap bracelet
    "bracelet_10.png" = "photo-1535632066927-ab7c9ab60908"  # hinged bangle
    "bracelet_11.png" = "photo-1612817159949-195b6eb9e31a"  # pearl bracelet
    "bracelet_12.png" = "photo-1589128777073-263566ae5e4d"  # beaded bracelet
    "bracelet_13.png" = "photo-1599458252573-56ae36120de1"  # slider bracelet
    "bracelet_14.png" = "photo-1606760227091-3dd870d97f1d"  # bar bracelet
    "bracelet_15.png" = "photo-1574634534894-89d080c7c36c"  # coil bracelet

    # SETS (15 unique)
    "set_1.png"  = "photo-1601121141461-9d6647bca1ed"  # complete gold set
    "set_2.png"  = "photo-1600721391689-2564bb8055de"  # bridal set
    "set_3.png"  = "photo-1611591437281-460bfbe1220a"  # party set
    "set_4.png"  = "photo-1617038260897-41a1f14a8ca0"  # pearl set
    "set_5.png"  = "photo-1630019852942-f89202989a59"  # emerald set
    "set_6.png"  = "photo-1605100804763-247f67b3557e"  # royal set
    "set_7.png"  = "photo-1596944924616-7b38e7cfac36"  # silver set
    "set_8.png"  = "photo-1603561591411-07134e71a2a9"  # vintage set
    "set_9.png"  = "photo-1602751584552-8ba73aad10e1"  # rose gold set
    "set_10.png" = "photo-1543294001-f7cd5d7fb516"  # engagement set
    "set_11.png" = "photo-1573408301185-9146fe634ad0"  # minimalist set
    "set_12.png" = "photo-1611085583191-a3b181a88401"  # diamond set
    "set_13.png" = "photo-1589128777073-263566ae5e4d"  # bohemian set
    "set_14.png" = "photo-1599643478518-a784e5dc4c8f"  # statement set
    "set_15.png" = "photo-1588444837495-c6cfeb53f32d"  # luxury set
}

$count = 0
$total = $images.Count

foreach ($entry in $images.GetEnumerator()) {
    $count++
    $outPath = Join-Path $base $entry.Key
    $url = "https://images.unsplash.com/$($entry.Value)?w=800&h=1000&fit=crop&q=80"
    Write-Host "[$count/$total] Downloading $($entry.Key)..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $outPath -ErrorAction Stop
        Write-Host "  OK ($((Get-Item $outPath).Length) bytes)"
    } catch {
        Write-Host "  FAILED: $($_.Exception.Message)"
    }
}

Write-Host "`nDone! Downloaded $count images."
