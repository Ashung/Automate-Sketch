
# Replace space to "_"
for img in *.png; do
    name=$(echo ${img} | sed 's/[[:space:]]/_/g')
    mv "${img}" ${name}
done

# Make dir
if [ ! -d drawable-mdpi ]; then
    mkdir drawable-mdpi
fi

if [ ! -d drawable-hdpi ]; then
    mkdir drawable-hdpi
fi

if [ ! -d drawable-xhdpi ]; then
    mkdir drawable-xhdpi
fi

if [ ! -d drawable-xxhdpi ]; then
    mkdir drawable-xxhdpi
fi

if [ ! -d drawable-xxxhdpi ]; then
    mkdir drawable-xxxhdpi
fi

# Copy _?dpi.png to drawable-?dpi folder
for img in $(ls | grep _mdpi.png); do
    mv ${img} drawable-mdpi/$(echo ${img} | sed 's/_mdpi//')
done

for img in $(ls | grep _hdpi.png); do
    mv ${img} drawable-hdpi/$(echo ${img} | sed 's/_hdpi//')
done

for img in $(ls | grep _xhdpi.png); do
    mv ${img} drawable-xhdpi/$(echo ${img} | sed 's/_xhdpi//')
done

for img in $(ls | grep _xxhdpi.png); do
    mv ${img} drawable-xxhdpi/$(echo ${img} | sed 's/_xxhdpi//')
done

for img in $(ls | grep _xxxhdpi.png); do
    mv ${img} drawable-xxxhdpi/$(echo ${img} | sed 's/_xxxhdpi//')
done
