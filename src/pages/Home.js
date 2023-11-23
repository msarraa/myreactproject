import React from "react";
// import ResponsiveSymbol from '../component/ResponsiveSymbol';

class Home extends React.Component {
  render() {
    return (
      <section class="about-us">
        <div class="row">
          <div className="about-col">
            <img src="images/person.png" alt="Personen bakom websidan." />
          </div>
          <div className="about-col">
            <h3>Varmt Välkommen hit! <br/>För dig som föredrar annorlunda</h3>
            <p>Jag som nästan aldrig sitter still i båten heter Marléne och hittas i Gällivare. Jag designar, trycker på muggar, nyckelringar, glasunderlägg, gosedjur, väskor och allt möjligt. Det du beställer kommer direkt från oss "Belle Bi", Namnet är hämtat från barnramsan "Elle Belle Bi".</p>
            <p>Jag hoppas att du ska hitta något som du tycker om och är det nånting du funderar över så får du jättegärna höra av dig.</p>
            
          </div>
        </div>
      </section>
    );
  }
}

export default Home;
