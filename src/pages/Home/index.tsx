import { Header } from "../../components/Core/Header";
import { Container } from "./styles";

interface HomeProps {
  onChangeTheme: () => void
}

export function Home({ onChangeTheme }: HomeProps) {
  return (
    <Container>
      <Header onChangeTheme={onChangeTheme} />
    </Container>
  )
}