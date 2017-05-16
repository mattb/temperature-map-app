#!/bin/bash -e

# --------------------------------------------------------
# Generate app icons and xcassets file from a single image
# Ben Clayton, Calvium Ltd. 
# --------------------------------------------------------
# To use this, place script in `appname` folder inside your project (i.e. the folder that Xcode generates for you containing your source code, it's named after whatever you called the app). 
# Create folder there called `RawImages`. 
# Source icon should 1024x1024 and be called appIcon.png. If the icon changes, you can just run this again to regenerate everything.
# This script assumes that you have the default setup of an Images.xcassets file containing the AppIcon.appiconset. 
# Adjust iconPath below if you use something different
sourceIconName="RawImages/appIcon.png"

# Ensure we're running in location of script.
#cd "`dirname $0`"

# Check imagemagick is installed
# http://stackoverflow.com/questions/592620/check-if-a-program-exists-from-a-bash-script
command -v convert >/dev/null 2>&1 || { echo >&2 "I require imagemagick but it's not installed.  Aborting."; exit 1; }

iconPath="Images.xcassets/AppIcon.appiconset"

mkdir -p "$iconPath"

# clean it out
rm -rf $iconPath/*.png

# iPhone and iPad iOS7+ Sizes
convert $sourceIconName -resize 120x120 $iconPath/appicon-60@2x.png
convert $sourceIconName -resize 180x180 $iconPath/appicon-60@3x.png
convert $sourceIconName -resize 76x76 $iconPath/appicon-76.png
convert $sourceIconName -resize 152x152 $iconPath/appicon-76@2x.png
convert $sourceIconName -resize 40x40 $iconPath/appicon-Small-40.png
convert $sourceIconName -resize 80x80 $iconPath/appicon-Small-40@2x.png
convert $sourceIconName -resize 120x120 $iconPath/appicon-Small-40@3x.png
convert $sourceIconName -resize 29x29 $iconPath/appicon-Small.png
convert $sourceIconName -resize 58x58 $iconPath/appicon-Small@2x.png
convert $sourceIconName -resize 87x87 $iconPath/appicon-Small@3x.png
convert $sourceIconName -resize 167x167 $iconPath/appicon-Small-83.5@2x.png

cat > "$iconPath/Contents.json" << EOF
{
  "images" : [
    {
      "idiom" : "iphone",
      "scale" : "2x",
      "size" : "60x60"
	   ,"filename" : "appicon-60@2x.png"
    },
    {
      "idiom" : "iphone",
      "scale" : "3x",
      "size" : "60x60"
       ,"filename" : "appicon-60@3x.png"
    },
    {
      "idiom" : "ipad",
      "scale" : "1x",
      "size" : "76x76"
      ,"filename" : "appicon-76.png"
    },
    {
      "idiom" : "ipad",
      "scale" : "2x",
      "size" : "76x76"
      ,"filename" : "appicon-76@2x.png"
    },
    {
      "idiom" : "iphone",
      "scale" : "1x",
      "size" : "29x29"
      ,"filename" : "appicon-Small.png"
    },
    {
      "idiom" : "iphone",
      "scale" : "2x",
      "size" : "29x29"
      ,"filename" : "appicon-Small@2x.png"
    },
    {
      "idiom" : "iphone",
      "scale" : "3x",
      "size" : "29x29"
      ,"filename" : "appicon-Small@3x.png"
    },
    {
      "idiom" : "iphone",
      "scale" : "2x",
      "size" : "40x40"
      ,"filename" : "appicon-Small-40@2x.png"
    },
    {
      "idiom" : "iphone",
      "scale" : "3x",
      "size" : "40x40"
      ,"filename" : "appicon-Small-40@3x.png"
    },
    {
      "idiom" : "ipad",
      "scale" : "1x",
      "size" : "40x40"
      ,"filename" : "appicon-Small-40.png"
    },
    {
      "idiom" : "ipad",
      "scale" : "2x",
      "size" : "40x40"
      ,"filename" : "appicon-Small-40@2x.png"
    },
    {
      "idiom" : "ipad",
      "scale" : "1x",
      "size" : "29x29"
      ,"filename" : "appicon-Small.png"
    },
    {
      "idiom" : "ipad",
      "scale" : "2x",
      "size" : "29x29"
      ,"filename" : "appicon-Small@2x.png"
    },
    {
      "idiom": "ipad",
      "scale": "2x",
      "size": "83.5x83.5",
      "filename": "appicon-Small-83.5@2x.png"
    },
  ],
  "info" : {
    "version" : 1,
    "author" : "xcode"
  },
  "properties" : {
    "pre-rendered" : true
  }
}
EOF
