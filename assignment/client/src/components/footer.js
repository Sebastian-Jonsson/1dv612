import React from "react";
import youtubeIcon from "../icons/youtube-symbol 1.svg";


function Footer() {
  return (
    <footer>
      <h4>
        Part of the course 1DV612, Sebastian
        Jonsson(sj223gb) &copy; 2021
      </h4>
      <ul>
        <li>
          <a href="https://www.youtube.com/channel/UCuCaLfTLFaO3s6TnttSP59A">
            <img src={youtubeIcon} alt="youtube-symbol social" />
          </a>
        </li>
      </ul>
    </footer>
  );
}

export default Footer;
