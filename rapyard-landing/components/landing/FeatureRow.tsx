const features = [

    {
        title: "Recording Booth",
        desc: "Capture your ideas."
    },

    {
        title: "Beat Discovery",
        desc: "Find your next sound."
    },

    {
        title: "Battle Arena",
        desc: "Challenge. Compete. Improve."
    },

    {
        title: "The Yard",
        desc: "Stay connected."
    },

    {
        title: "Creator Profile",
        desc: "Build your identity."
    },

    {
        title: "Studio Pro Lite",
        desc: "Create with speed."
    }

];

export default function FeatureRow() {

    return (

        <section className="features">

            <h2>FOUNDERS EDITION</h2>

            <div className="featureGrid">

                {features.map((item) => (

                    <div className="featureCard" key={item.title}>

                        <h3>{item.title}</h3>

                        <p>{item.desc}</p>

                    </div>

                ))}

            </div>

        </section>

    );

}