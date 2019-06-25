import { connect } from 'react-redux';
import ProfileRoot from 'react-components/profile-root/profile-root.component';
import { getContextsWithProfilePages } from 'react-components/profile-root/profile-root.selectors';
import { getSelectedContext } from 'reducers/app.selectors';
import { openModal } from 'react-components/shared/profile-selector/profile-selector.actions';

function mapStateToProps(state) {
  const selectedContext = getSelectedContext(state);
  const { contexts } = state.app;
  const selectorContexts = getContextsWithProfilePages(contexts);

  // we make sure the globally selected context is available in the selectorContexts
  const activeContext = selectedContext
    ? selectorContexts.find(ctx => {
        if (DISABLE_MULTIPLE_CONTEXT_PROFILES) {
          return ctx.countryName === 'BRAZIL' && ctx.commodityName === 'SOY';
        }
        return ctx.id === selectedContext.id;
      })
    : null;

  const parsedTopProfiles = state.profileRoot.topProfiles?.map(profile => ({
    title: profile.nodeName,
    subtitle: profile.summary,
    category: profile.profileType,
    imageUrl: profile.photoUrl,
    href: `/profile-${profile.profileType}?nodeId=${profile.nodeId}&contextId=${
      profile.contextId
    }&year=${profile.year}`
  }));

  return {
    activeContext,
    getContextsWithProfilePages,
    errorMessage: state.profileRoot.errorMessage,
    topProfiles: parsedTopProfiles,
    contexts
  };
}

const mapDispatchToProps = {
  openModal
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileRoot);
