<script lang="ts">
    import ExplainerCard from "../section/ExplainerCard.svelte";
</script>

<ExplainerCard --margin="12px 0 0 0"
    image="/images/hungary-shape.webp"
    alt="Választási földrajz"
>
    A szimuláció azt feltételezi, hogy az EP-választás óta nem
    változott a választási földrajz, de az ellenzéki szavazók
    nagyobb része szavaz majd a Tiszára.
    <a href="#">Módszertan</a>
</ExplainerCard>
<ExplainerCard --margin="none"
    image="/images/median-example.webp"
    alt="Medián jelzés példa"
>
    A függőleges vonal a középérteket jelzi, vagyis ugyanannyi
    szimulációban kapott ennél több vagy kevesebb mandátumot egy
    adott párt.
</ExplainerCard>
<ExplainerCard --margin="0 0 12px 0"
    image="/images/PDF-example.webp"
    alt="Valószínűség eloszlás példa"
>
    A színezett terület a lehetséges eredményeket és azok
    valószínűségét mutatja. Minél több szimulációban fordult elő
    egy mandátumszám, annál magasabb a terület.
</ExplainerCard>