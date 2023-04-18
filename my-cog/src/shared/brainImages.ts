

export interface BrainImage {
    url: string;
    title: string;
    azimuth: number;
    elevation: number;
}


export const brainImages: BrainImage[] =
    [
        {
            url: "brain_img_0_0.png",
            title: "Azimuth 0°, Elevation 0°",
            azimuth: 0,
            elevation: 0
        },
        {
            url: "brain_img_90_0.png",
            title: "Azimuth 90°, Elevation 0°",
            azimuth: 90,
            elevation: 0
        },
        {
            url: "brain_img_180_0.png",
            title: "Azimuth 180°, Elevation 0°",
            azimuth: 180,
            elevation: 0
        },
        {
            url: "brain_img_270_0.png",
            title: "Azimuth 270°, Elevation 0°",
            azimuth: 270,
            elevation: 0
        },
        {
            url: "brain_img_0_90.png",
            title: "Azimuth 0°, Elevation 90°",
            azimuth: 0,
            elevation: 90
        },
    ];
