import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  LoadingIndicator,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: true,
    page: 1,
    onEndReachedCalledDuringMomentum: false,
  };

  async componentDidMount() {
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({
      stars: response.data,
      loading: false,
      loadingMore: false,
    });
  }

  loadMore = async user => {
    const { stars, page, onEndReachedCalledDuringMomentum } = this.state;

    if (!onEndReachedCalledDuringMomentum) {
      this.setState({ loadingMore: true });

      const newPage = page + 1;

      const response = await api.get(`/users/${user.login}/starred`, {
        params: {
          page: newPage,
        },
      });

      this.setState({
        stars: [...stars, ...response.data],
        page: newPage,
        onEndReachedCalledDuringMomentum: true,
        loadingMore: false,
      });
    }
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, loadingMore } = this.state;

    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? (
          <LoadingIndicator />
        ) : (
          <Stars
            data={stars}
            keyExtractor={star => String(star.id)}
            onEndReachedThreshold={0.25}
            onEndReached={() => this.loadMore(user)}
            onMomentumScrollBegin={() =>
              this.setState({
                onEndReachedCalledDuringMomentum: false,
              })
            }
            renderItem={({ item }) => (
              <Starred>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}

        {loadingMore && <ActivityIndicator color="#7159c1" />}
      </Container>
    );
  }
}
