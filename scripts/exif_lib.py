from PIL import Image
from PIL import ExifTags

exposure_programs = [
    'Not defined',
    'Manual',
    'Normal program',
    'Aperture priority',
    'Shutter priority',
    'Creative program',
    'Action program',
    'Portrait mode',
    'Landscape mode'
]


def get_exif(image: Image):
    _exif = {}
    info = image._getexif()
    for tag, value in info.items():
        decoded = ExifTags.TAGS.get(tag, tag)
        _exif[decoded] = value

    return {
        'ISOSpeedRatings': get_int(_exif, 'ISOSpeedRatings'),
        'FocalLength': get_string(_exif, 'FocalLengthIn35mmFilm') if 'FocalLengthIn35mmFilm' in _exif
        else parse_tuple(_exif, 'FocalLength'),
        'FNumber': parse_tuple(_exif, 'FNumber'),
        'ExposureTime': parse_tuple(_exif, 'ExposureTime', True),
        'Make': get_string(_exif, 'Make'),
        'Model': get_string(_exif, 'Model'),
        'ExposureProgram': get_value(_exif, 'ExposureProgram', exposure_programs)
    }


def get_string(exif, tag):
    return str(exif[tag])


def get_int(exif, tag):
    return int(exif[tag])


def get_value(exif, tag, arr):
    return arr[get_int(exif, tag)]


def parse_tuple(exif, tag, fraction=False):
    _tuple = exif[tag]
    result = _tuple[0] / _tuple[1]
    if fraction and result < 1:
        return f'1/{int(_tuple[1] / _tuple[0])}'
    else:
        return float(result)
