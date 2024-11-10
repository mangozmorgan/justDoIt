// useTemplateWrapperLogic.ts
import { useAuth } from '../../../contexts/AuthContext';
import LogoAndTitleView from '../LogoAndTitle/LogoAndTitleView';
import Logo from '../LogoHome/LogoHomeView'; // Si Logo est un autre composant

const TemplateWrapperLogic = () => {
  const { user } = useAuth();

  // Vérifier si l'utilisateur est connecté
  const isConnected = () => user ? true : false;

  // Logique pour afficher ou non le bouton de déconnexion
  const displayDisconnectButton = () => {
    return isConnected() ? true : false;
  };

  // Logique pour choisir quel logo afficher
  const getLogo = () => {
    return isConnected() ? <LogoAndTitleView /> : <Logo />; 
  };

  return {
    isConnected,
    displayDisconnectButton,
    getLogo,
  };
};

export default TemplateWrapperLogic;
